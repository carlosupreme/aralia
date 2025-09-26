<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\Level;
use App\Models\Multimedia;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class LevelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Program $program)
    {
        // Only psychologists who own the program can create levels
        if (!auth()->user()->isPsychologist() || $program->psychologist_id !== auth()->id()) {
            abort(403, 'No tienes permisos para crear niveles en este programa.');
        }

        return Inertia::render('Levels/Create', [
            'program' => $program->load(['levels' => function ($query) {
                $query->orderBy('order_index');
            }]),
            'multimediaTypes' => Multimedia::TYPES,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Program $program)
    {
        // Only psychologists who own the program can create levels
        if (!auth()->user()->isPsychologist() || $program->psychologist_id !== auth()->id()) {
            abort(403, 'No tienes permisos para crear niveles en este programa.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'multimedia' => 'array',
            'multimedia.*.name' => 'required_with:multimedia.*.url|string|max:255',
            'multimedia.*.description' => 'nullable|string',
            'multimedia.*.url' => 'required_with:multimedia.*.name|string',
            'multimedia.*.type' => 'required_with:multimedia.*.url|in:' . implode(',', array_keys(Multimedia::TYPES)),
            'multimedia.*.size' => 'nullable|string|max:50',
            'multimedia.*.duration' => 'nullable|string|max:50',
        ]);

        // Debug: Log validated data
        \Log::info('Level store validated data:', $validated);

        DB::transaction(function () use ($validated, $program) {
            // Get next order index
            $nextOrderIndex = $program->levels()->max('order_index') + 1;

            $level = $program->levels()->create([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'order_index' => $nextOrderIndex,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            // Create multimedia resources
            if (!empty($validated['multimedia'])) {
                foreach ($validated['multimedia'] as $index => $multimediaData) {
                    // Only create multimedia if both name and URL are provided
                    if (!empty($multimediaData['name']) && !empty($multimediaData['url'])) {
                        \Log::info('Creating multimedia item:', $multimediaData);
                        $level->multimedia()->create([
                            'name' => $multimediaData['name'],
                            'description' => $multimediaData['description'] ?? '',
                            'url' => $multimediaData['url'],
                            'type' => $multimediaData['type'],
                            'size' => $multimediaData['size'] ?? '',
                            'duration' => $multimediaData['duration'] ?? '',
                            'order_index' => $index,
                            'is_active' => true,
                        ]);
                    } else {
                        \Log::info('Skipping incomplete multimedia item:', $multimediaData);
                    }
                }
            }
        });

        return redirect()->route('programs.show', $program->id)
            ->with('success', 'Nivel creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Level $level)
    {
        $user = auth()->user();

        // Check permissions
        if ($user->isPsychologist() && $level->program->psychologist_id !== $user->id) {
            abort(403, 'No tienes acceso a este nivel.');
        } elseif ($user->isStudent() && !$level->program->hasStudent($user)) {
            abort(403, 'No estás inscrito en este programa.');
        }

        $level->load(['program', 'multimedia' => function ($query) {
            $query->where('is_active', true)->orderBy('order_index');
        }]);

        return Inertia::render('Levels/Show', [
            'level' => $level,
            'isUnlocked' => $user->isStudent() ? $level->isUnlockedFor($user) : true,
            'isCompleted' => $user->isStudent() ? $level->isCompletedFor($user) : false,
        ]);
    }

    /**
     * Student POV - Display level content in MOOC-like interface
     */
    public function studentView(Level $level)
    {
        $level->load(['program', 'multimedia' => function ($query) {
            $query->where('is_active', true)->orderBy('order_index');
        }]);

        // Get all levels from the same program for navigation
        $allLevels = $level->program->levels()
            ->where('is_active', true)
            ->orderBy('order_index')
            ->get(['id', 'name', 'order_index']);

        return Inertia::render('Levels/StudentView', [
            'level' => $level,
            'allLevels' => $allLevels,
            'currentLevelIndex' => $allLevels->search(function ($item) use ($level) {
                return $item->id === $level->id;
            }),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Level $level)
    {
        // Only the program owner can edit levels
        if (!auth()->user()->isPsychologist() || $level->program->psychologist_id !== auth()->id()) {
            abort(403, 'No tienes permisos para editar este nivel.');
        }

        $level->load(['multimedia' => function ($query) {
            $query->orderBy('order_index');
        }]);

        return Inertia::render('Levels/Edit', [
            'level' => $level,
            'program' => $level->program,
            'multimediaTypes' => Multimedia::TYPES,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Level $level)
    {
        // Only the program owner can update levels
        if (!auth()->user()->isPsychologist() || $level->program->psychologist_id !== auth()->id()) {
            abort(403, 'No tienes permisos para actualizar este nivel.');
        }

        // Debug: Log incoming request data
        \Log::info('Level update request data:', $request->all());

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'multimedia' => 'array',
            'multimedia.*.id' => 'nullable|exists:multimedia,id',
            'multimedia.*.name' => 'required_with:multimedia.*.url|string|max:255',
            'multimedia.*.description' => 'nullable|string',
            'multimedia.*.url' => 'required_with:multimedia.*.name|string',
            'multimedia.*.type' => 'required_with:multimedia.*.url|in:' . implode(',', array_keys(Multimedia::TYPES)),
            'multimedia.*.size' => 'nullable|string|max:50',
            'multimedia.*.duration' => 'nullable|string|max:50',
        ]);

        // Debug: Log validated data
        \Log::info('Level update validated data:', $validated);

        DB::transaction(function () use ($validated, $level) {
            $level->update([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'is_active' => $validated['is_active'] ?? true,
            ]);

            // Handle multimedia updates
            $existingMultimediaIds = [];

            if (!empty($validated['multimedia'])) {
                foreach ($validated['multimedia'] as $index => $multimediaData) {
                    // Only process multimedia if both name and URL are provided
                    if (!empty($multimediaData['name']) && !empty($multimediaData['url'])) {
                        if (!empty($multimediaData['id'])) {
                            // Update existing multimedia
                            $multimedia = $level->multimedia()->find($multimediaData['id']);
                            if ($multimedia) {
                                \Log::info('Updating multimedia item:', $multimediaData);
                                $multimedia->update([
                                    'name' => $multimediaData['name'],
                                    'description' => $multimediaData['description'] ?? '',
                                    'url' => $multimediaData['url'],
                                    'type' => $multimediaData['type'],
                                    'size' => $multimediaData['size'] ?? '',
                                    'duration' => $multimediaData['duration'] ?? '',
                                    'order_index' => $index,
                                ]);
                                $existingMultimediaIds[] = $multimedia->id;
                            }
                        } else {
                            // Create new multimedia
                            \Log::info('Creating new multimedia item:', $multimediaData);
                            $multimedia = $level->multimedia()->create([
                                'name' => $multimediaData['name'],
                                'description' => $multimediaData['description'] ?? '',
                                'url' => $multimediaData['url'],
                                'type' => $multimediaData['type'],
                                'size' => $multimediaData['size'] ?? '',
                                'duration' => $multimediaData['duration'] ?? '',
                                'order_index' => $index,
                                'is_active' => true,
                            ]);
                            $existingMultimediaIds[] = $multimedia->id;
                        }
                    } else {
                        \Log::info('Skipping incomplete multimedia item:', $multimediaData);
                        // If it's an existing item being updated but now incomplete, keep its ID so it doesn't get deleted
                        if (!empty($multimediaData['id'])) {
                            $existingMultimediaIds[] = $multimediaData['id'];
                        }
                    }
                }
            }

            // Delete removed multimedia
            $level->multimedia()->whereNotIn('id', $existingMultimediaIds)->delete();
        });

        return redirect()->route('programs.show', $level->program->id)
            ->with('success', 'Nivel actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Level $level)
    {
        // Only the program owner can delete levels
        if (!auth()->user()->isPsychologist() || $level->program->psychologist_id !== auth()->id()) {
            abort(403, 'No tienes permisos para eliminar este nivel.');
        }

        $level->delete();

        return redirect()->route('programs.show', $level->program->id)
            ->with('success', 'Nivel eliminado exitosamente.');
    }

    /**
     * Unlock a level for a student
     */
    public function unlockForStudent(Level $level, User $student)
    {
        // Only the program owner can unlock levels
        if (!auth()->user()->isPsychologist() || $level->program->psychologist_id !== auth()->id()) {
            abort(403, 'No tienes permisos para desbloquear niveles.');
        }

        if (!$student->isStudent()) {
            return back()->withErrors(['error' => 'El usuario debe ser un estudiante.']);
        }

        if (!$level->program->hasStudent($student)) {
            return back()->withErrors(['error' => 'El estudiante no está inscrito en este programa.']);
        }

        $level->unlockFor($student);

        return back()->with('success', 'Nivel desbloqueado para ' . $student->name);
    }

    /**
     * Mark level as complete for a student
     */
    public function markComplete(Level $level, User $student)
    {
        // Only the program owner can mark levels as complete
        if (!auth()->user()->isPsychologist() || $level->program->psychologist_id !== auth()->id()) {
            abort(403, 'No tienes permisos para marcar niveles como completados.');
        }

        if (!$student->isStudent()) {
            return back()->withErrors(['error' => 'El usuario debe ser un estudiante.']);
        }

        if (!$level->isUnlockedFor($student)) {
            return back()->withErrors(['error' => 'El nivel debe estar desbloqueado antes de marcarlo como completado.']);
        }

        $level->completeFor($student);

        // Auto-unlock next level
        $nextLevel = $level->nextLevel();
        if ($nextLevel) {
            $nextLevel->unlockFor($student);
        }

        return back()->with('success', 'Nivel marcado como completado para ' . $student->name);
    }
}
