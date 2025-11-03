<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Program;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Display all student's payments across all programs
     */
    public function studentIndex()
    {
        $user = auth()->user();

        // Get all enrolled programs with their latest payment status
        $programs = $user->enrolledPrograms()->with(['payments' => function ($query) use ($user) {
            $query->where('user_id', $user->id)->latest();
        }])->get();

        // Get all payments for the student
        $payments = $user->payments()
            ->with('program')
            ->latest()
            ->get();

        return Inertia::render('Payments/StudentIndex', [
            'programs' => $programs,
            'payments' => $payments,
        ]);
    }

    /**
     * Display student's payment history for a specific program
     */
    public function index(Program $program)
    {
        $user = auth()->user();

        // Check if student is enrolled in the program
        if ($user->isStudent() && !$program->hasStudent($user)) {
            abort(403, 'No estás inscrito en este programa.');
        }

        $payments = $user->payments()
            ->where('program_id', $program->id)
            ->with('program')
            ->latest()
            ->get();

        $latestConfirmedPayment = $user->latestConfirmedPaymentFor($program);
        $needsPayment = $user->needsToPayFor($program);

        return Inertia::render('Programs/StudentPayments', [
            'program' => $program,
            'payments' => $payments,
            'latestConfirmedPayment' => $latestConfirmedPayment,
            'needsPayment' => $needsPayment,
        ]);
    }

    /**
     * Show payment upload form
     */
    public function create(Program $program)
    {
        $user = auth()->user();

        if ($user->isStudent() && !$program->hasStudent($user)) {
            abort(403, 'No estás inscrito en este programa.');
        }

        return Inertia::render('Payments/Create', [
            'program' => $program,
        ]);
    }

    /**
     * Store a new payment with receipt
     */
    public function store(Request $request, Program $program)
    {
        $user = auth()->user();

        if ($user->isStudent() && !$program->hasStudent($user)) {
            abort(403, 'No estás inscrito en este programa.');
        }

        $validated = $request->validate([
            'receipt' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120', // 5MB max
        ]);

        // Store receipt file
        $receiptPath = $request->file('receipt')->store('receipts', 'public');

        // Calculate due date based on latest confirmed payment
        $latestPayment = $user->latestConfirmedPaymentFor($program);
        $dueDate = null;

        if ($latestPayment && $latestPayment->due_date) {
            // Next month from previous due date
            $dueDate = $latestPayment->due_date->addMonth();
        }

        // Create payment record
        $payment = Payment::create([
            'user_id' => $user->id,
            'program_id' => $program->id,
            'amount' => $program->monthly_price,
            'due_date' => $dueDate, // Will be set when admin confirms first payment
            'payment_date' => now(),
            'status' => Payment::STATUS_PENDING,
            'receipt_url' => '/storage/' . $receiptPath,
        ]);

        // Notify the program's psychologist
        $payment->load(['user', 'program']);
        Notification::createPaymentReceived($program->psychologist, $payment);

        return redirect()->route('payments.index', $program)
            ->with('success', 'Comprobante de pago enviado. El administrador lo revisará pronto.');
    }

    /**
     * Admin: List all pending payments
     */
    public function adminIndex(Request $request)
    {
        $user = auth()->user();

        if (!$user->isPsychologist()) {
            abort(403, 'No tienes permiso para ver esta página.');
        }

        $query = Payment::with(['user', 'program'])
            ->whereHas('program', function ($q) use ($user) {
                $q->where('psychologist_id', $user->id);
            });

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $payments = $query->latest()->paginate(20);

        return Inertia::render('Payments/AdminIndex', [
            'payments' => $payments,
            'filters' => $request->only(['status']),
        ]);
    }

    /**
     * Admin: Approve a payment
     */
    public function approve(Request $request, Payment $payment)
    {
        $user = auth()->user();

        // Check permission
        if (!$user->isPsychologist() || $payment->program->psychologist_id !== $user->id) {
            abort(403, 'No tienes permiso para aprobar este pago.');
        }

        if (!$payment->isPending()) {
            return back()->with('error', 'Este pago ya fue procesado.');
        }

        // If this is the first payment, set the due date
        $dueDate = $payment->due_date;
        if (!$dueDate) {
            // Set due date to one month from now
            $dueDate = now()->addMonth()->startOfDay();
        }

        $payment->update([
            'status' => Payment::STATUS_CONFIRMED,
            'paid_at' => now(),
            'due_date' => $dueDate,
        ]);

        // Notify the student
        $payment->load(['user', 'program']);
        Notification::createPaymentApproved($payment->user, $payment);

        return back()->with('success', 'Pago confirmado exitosamente.');
    }

    /**
     * Admin: Reject a payment
     */
    public function reject(Request $request, Payment $payment)
    {
        $user = auth()->user();

        // Check permission
        if (!$user->isPsychologist() || $payment->program->psychologist_id !== $user->id) {
            abort(403, 'No tienes permiso para rechazar este pago.');
        }

        if (!$payment->isPending()) {
            return back()->with('error', 'Este pago ya fue procesado.');
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $payment->update([
            'status' => Payment::STATUS_REJECTED,
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        // Notify the student
        $payment->load(['user', 'program']);
        Notification::createPaymentRejected($payment->user, $payment);

        return back()->with('success', 'Pago rechazado.');
    }
}
