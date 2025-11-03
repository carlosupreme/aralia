<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgramController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();

        if ($user->isPsychologist()) {
            // Psychologists see their created programs
            $programs = $user->createdPrograms()
                ->with(['levels', 'students'])
                ->withCount(['levels', 'students'])
                ->latest()
                ->get();
        } else {
            // Students see their enrolled programs
            $programs = $user->enrolledPrograms()
                ->with(['levels', 'psychologist'])
                ->withCount('levels')
                ->get();
        }

        return Inertia::render('Programs/Index', [
            'programs' => $programs,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Only psychologists can create programs
        if (!auth()->user()->isPsychologist()) {
            abort(403, 'No tienes permisos para crear programas.');
        }

        return Inertia::render('Programs/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Only psychologists can create programs
        if (!auth()->user()->isPsychologist()) {
            abort(403, 'No tienes permisos para crear programas.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $program = auth()->user()->createdPrograms()->create($validated);

        return redirect()->route('programs.show', $program->id)
            ->with('success', 'Programa creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Program $program)
    {
        $user = auth()->user();

        // Check if user has access to this program
        if ($user->isPsychologist() && $program->psychologist_id !== $user->id) {
            abort(403, 'No tienes acceso a este programa.');
        } elseif ($user->isStudent() && !$program->hasStudent($user)) {
            abort(403, 'No estás inscrito en este programa.');
        }

        $program->load([
            'levels' => function ($query) {
                $query->orderBy('order_index');
            },
            'levels.multimedia' => function ($query) {
                $query->where('is_active', true)->orderBy('order_index');
            },
            'psychologist:id,name,email',
            'students:id,name,email'
        ]);

        // For students, add their level unlock and access status
        if ($user->isStudent()) {
            // Get unlocked levels (levels explicitly unlocked for the user)
            $unlockedLevels = $user->unlockedLevels()
                ->where('program_id', $program->id)
                ->pluck('level_id')
                ->toArray();

            // Get accessible levels (unlocked + all previous levels)
            $accessibleLevels = $user->getAccessibleLevelsForProgram($program);

            $program->levels->map(function ($level) use ($unlockedLevels, $accessibleLevels, $user) {
                // A level is unlocked if it's in the unlocked levels list
                $level->is_unlocked_for_user = in_array($level->id, $unlockedLevels);

                // A level is accessible if it's in the accessible levels list
                // (unlocked OR previous to an unlocked level)
                $level->is_accessible_for_user = in_array($level->id, $accessibleLevels);

                // Check if completed
                $level->is_completed_for_user = $level->isCompletedFor($user);

                return $level;
            });
        }

        // For psychologists, add student progress data
        if ($user->isPsychologist()) {
            $program->students->map(function ($student) use ($program) {
                // Get level progress for this student
                $student->level_progress = $program->levels->map(function ($level) use ($student) {
                    return [
                        'level_id' => $level->id,
                        'level_name' => $level->name,
                        'level_order' => $level->order_index,
                        'is_unlocked' => $level->isUnlockedFor($student),
                        'is_completed' => $level->isCompletedFor($student),
                    ];
                })->values();

                return $student;
            });
        }

        return Inertia::render('Programs/Show', [
            'program' => $program,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Program $program)
    {
        // Only the creator can edit the program
        if (!auth()->user()->isPsychologist() || $program->psychologist_id !== auth()->id()) {
            abort(403, 'No tienes permisos para editar este programa.');
        }

        return Inertia::render('Programs/Edit', [
            'program' => $program,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Program $program)
    {
        // Only the creator can update the program
        if (!auth()->user()->isPsychologist() || $program->psychologist_id !== auth()->id()) {
            abort(403, 'No tienes permisos para actualizar este programa.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $program->update($validated);

        return redirect()->route('programs.show', $program->id)
            ->with('success', 'Programa actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Program $program)
    {
        // Only the creator can delete the program
        if (!auth()->user()->isPsychologist() || $program->psychologist_id !== auth()->id()) {
            abort(403, 'No tienes permisos para eliminar este programa.');
        }

        $program->delete();

        return redirect()->route('programs.index')
            ->with('success', 'Programa eliminado exitosamente.');
    }

    /**
     * Enroll a student in a program
     */
    public function enrollStudent(Request $request, Program $program)
    {
        // Only the creator can enroll students
        if (!auth()->user()->isPsychologist() || $program->psychologist_id !== auth()->id()) {
            abort(403, 'No tienes permisos para inscribir estudiantes en este programa.');
        }

        $validated = $request->validate([
            'student_id' => 'required|exists:users,id',
        ]);

        $student = User::findOrFail($validated['student_id']);

        if (!$student->isStudent()) {
            return back()->withErrors(['student_id' => 'El usuario debe ser un estudiante.']);
        }

        if ($program->hasStudent($student)) {
            return back()->withErrors(['student_id' => 'El estudiante ya está inscrito en este programa.']);
        }

        $student->enrollInProgram($program);

        // Unlock the first level for the student
        $firstLevel = $program->firstLevel();
        if ($firstLevel) {
            $firstLevel->unlockFor($student);
        }

        return back()->with('success', 'Estudiante inscrito exitosamente.');
    }

    /**
     * Remove a student from a program
     */
    public function removeStudent(Program $program, User $student)
    {
        // Only the creator can remove students
        if (!auth()->user()->isPsychologist() || $program->psychologist_id !== auth()->id()) {
            abort(403, 'No tienes permisos para remover estudiantes de este programa.');
        }

        $program->students()->detach($student->id);
        $student->unlockedLevels()->where('program_id', $program->id)->detach();

        return back()->with('success', 'Estudiante removido del programa exitosamente.');
    }
}
