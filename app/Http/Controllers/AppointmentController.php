<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\AppointmentProposal;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AppointmentController extends Controller
{
    /**
     * Display appointments agenda (calendar + list views)
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Get appointments based on user role
        if ($user->isPsychologist()) {
            $appointments = Appointment::where('psychologist_id', $user->id)
                ->with(['student', 'program', 'proposals.proposedBy'])
                ->orderBy('scheduled_date')
                ->orderBy('scheduled_time')
                ->get();
        } else {
            $appointments = Appointment::where('student_id', $user->id)
                ->with(['psychologist', 'program', 'proposals.proposedBy'])
                ->orderBy('scheduled_date')
                ->orderBy('scheduled_time')
                ->get();
        }

        // Get programs for the filter/create form
        $programs = $user->isPsychologist()
            ? $user->createdPrograms()->with('students')->get()
            : $user->enrolledPrograms;

        // Count pending reschedule requests
        $pendingReschedules = $appointments->filter(function ($appointment) {
            return $appointment->isPending();
        })->count();

        return Inertia::render('Appointments/Index', [
            'appointments' => $appointments,
            'programs' => $programs,
            'pendingReschedules' => $pendingReschedules,
        ]);
    }

    /**
     * Store a new appointment
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'program_id' => 'required|exists:programs,id',
            'student_id' => 'required|exists:users,id',
            'scheduled_date' => 'required|date',
            'scheduled_time' => 'required',
            'duration_minutes' => 'required|integer|min:15',
            'meeting_type' => 'required|in:online,in-person',
            'meeting_link' => 'nullable|url',
            'notes' => 'nullable|string',
            'is_recurring' => 'boolean',
            'recurrence_pattern' => 'nullable|string|in:daily,weekly,monthly',
            'recurrence_count' => 'nullable|integer|min:1',
        ]);

        $user = $request->user();

        // Ensure the user is a psychologist
        if (!$user->isPsychologist()) {
            return back()->with('error', 'Solo los psicólogos pueden crear citas.');
        }

        // Verify the program belongs to the psychologist
        $program = Program::findOrFail($validated['program_id']);
        if ($program->psychologist_id !== $user->id) {
            return back()->with('error', 'No tienes permiso para crear citas en este programa.');
        }

        $validated['psychologist_id'] = $user->id;

        Appointment::create($validated);

        return back()->with('success', 'Cita creada exitosamente.');
    }

    /**
     * Update an appointment
     */
    public function update(Request $request, Appointment $appointment): RedirectResponse
    {
        $validated = $request->validate([
            'scheduled_date' => 'sometimes|date',
            'scheduled_time' => 'sometimes',
            'duration_minutes' => 'sometimes|integer|min:15',
            'meeting_type' => 'sometimes|in:online,in-person',
            'meeting_link' => 'nullable|url',
            'notes' => 'nullable|string',
        ]);

        $user = $request->user();

        // Ensure the user is the psychologist of this appointment
        if ($appointment->psychologist_id !== $user->id) {
            return back()->with('error', 'No tienes permiso para modificar esta cita.');
        }

        $appointment->update($validated);

        return back()->with('success', 'Cita actualizada exitosamente.');
    }

    /**
     * Cancel an appointment
     */
    public function destroy(Appointment $appointment): RedirectResponse
    {
        $user = auth()->user();

        // Both psychologist and student can cancel
        if ($appointment->psychologist_id !== $user->id && $appointment->student_id !== $user->id) {
            return back()->with('error', 'No tienes permiso para cancelar esta cita.');
        }

        $appointment->markAsCancelled();

        return back()->with('success', 'Cita cancelada exitosamente.');
    }

    /**
     * Mark appointment as completed
     */
    public function complete(Appointment $appointment): RedirectResponse
    {
        $user = auth()->user();

        // Only psychologist can mark as completed
        if ($appointment->psychologist_id !== $user->id) {
            return back()->with('error', 'Solo el psicólogo puede marcar la cita como completada.');
        }

        $appointment->markAsCompleted();

        return back()->with('success', 'Cita marcada como completada.');
    }

    /**
     * Initiate a reschedule request
     */
    public function initiateReschedule(Appointment $appointment): RedirectResponse
    {
        $user = auth()->user();

        // Both psychologist and student can initiate reschedule
        if ($appointment->psychologist_id !== $user->id && $appointment->student_id !== $user->id) {
            return back()->with('error', 'No tienes permiso para reprogramar esta cita.');
        }

        $appointment->markAsPendingReschedule();

        return back()->with('success', 'Solicitud de reprogramación iniciada.');
    }

    /**
     * Create a new proposal with date-time options
     */
    public function proposeNewDates(Request $request, Appointment $appointment): RedirectResponse
    {
        $validated = $request->validate([
            'proposed_dates' => 'required|array|min:1',
            'proposed_dates.*.date' => 'required|date',
            'proposed_dates.*.time' => 'required',
            'message' => 'nullable|string',
        ]);

        $user = $request->user();

        // Both psychologist and student can propose dates
        if ($appointment->psychologist_id !== $user->id && $appointment->student_id !== $user->id) {
            return back()->with('error', 'No tienes permiso para proponer nuevas fechas.');
        }

        AppointmentProposal::create([
            'appointment_id' => $appointment->id,
            'user_id' => $user->id,
            'proposed_dates' => $validated['proposed_dates'],
            'message' => $validated['message'] ?? null,
            'status' => AppointmentProposal::STATUS_PENDING,
        ]);

        // Mark appointment as pending reschedule if not already
        if (!$appointment->isPending()) {
            $appointment->markAsPendingReschedule();
        }

        return back()->with('success', 'Propuesta de reprogramación enviada.');
    }

    /**
     * Accept a proposal and reschedule the appointment
     */
    public function acceptProposal(Request $request, AppointmentProposal $proposal): RedirectResponse
    {
        $validated = $request->validate([
            'date_index' => 'required|integer|min:0',
        ]);

        $user = $request->user();
        $appointment = $proposal->appointment;

        // The other party (not the proposer) can accept
        if ($appointment->psychologist_id !== $user->id && $appointment->student_id !== $user->id) {
            return back()->with('error', 'No tienes permiso para aceptar esta propuesta.');
        }

        // Cannot accept your own proposal
        if ($proposal->user_id === $user->id) {
            return back()->with('error', 'No puedes aceptar tu propia propuesta.');
        }

        $dateIndex = $validated['date_index'];

        // Validate the date index exists in proposed_dates
        if (!isset($proposal->proposed_dates[$dateIndex])) {
            return back()->with('error', 'Fecha seleccionada inválida.');
        }

        // Accept the proposal
        $proposal->accept($dateIndex);

        // Update the appointment with the accepted date and time
        $acceptedDate = $proposal->proposed_dates[$dateIndex];
        $appointment->update([
            'scheduled_date' => $acceptedDate['date'],
            'scheduled_time' => $acceptedDate['time'],
            'status' => Appointment::STATUS_SCHEDULED,
        ]);

        // Reject all other pending proposals for this appointment
        $appointment->proposals()
            ->where('id', '!=', $proposal->id)
            ->where('status', AppointmentProposal::STATUS_PENDING)
            ->update(['status' => AppointmentProposal::STATUS_REJECTED]);

        return back()->with('success', 'Propuesta aceptada. La cita ha sido confirmada.');
    }

    /**
     * Reject a proposal
     */
    public function rejectProposal(AppointmentProposal $proposal): RedirectResponse
    {
        $user = auth()->user();
        $appointment = $proposal->appointment;

        // The other party (not the proposer) can reject
        if ($appointment->psychologist_id !== $user->id && $appointment->student_id !== $user->id) {
            return back()->with('error', 'No tienes permiso para rechazar esta propuesta.');
        }

        // Cannot reject your own proposal
        if ($proposal->user_id === $user->id) {
            return back()->with('error', 'No puedes rechazar tu propia propuesta.');
        }

        $proposal->reject();

        return back()->with('success', 'Propuesta rechazada.');
    }
}
