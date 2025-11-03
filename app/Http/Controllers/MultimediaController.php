<?php

namespace App\Http\Controllers;

use App\Models\Multimedia;
use App\Models\VideoProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MultimediaController extends Controller
{
    /**
     * Stream video with HTTP Range support
     */
    public function stream(Multimedia $multimedia)
    {
        // Check if user has access to this multimedia
        $user = auth()->user();
        $level = $multimedia->level;
        $program = $level->program;

        // Psychologists can only access their own program content
        if ($user->isPsychologist() && $program->psychologist_id !== $user->id) {
            abort(403, 'No tienes acceso a este contenido.');
        }

        // Students must be enrolled in the program
        if ($user->isStudent()) {
            if (!$program->hasStudent($user)) {
                abort(403, 'No estás inscrito en este programa.');
            }

            // Students must have the level unlocked
            if (!$level->isUnlockedFor($user)) {
                abort(403, 'Este nivel no está desbloqueado para ti. Completa los niveles anteriores primero.');
            }
        }

        // Get file path
        $path = str_replace('/storage/', '', $multimedia->url);
        $fullPath = storage_path('app/public/' . $path);

        if (!file_exists($fullPath)) {
            abort(404, 'Archivo no encontrado.');
        }

        $size = filesize($fullPath);
        $mimeType = mime_content_type($fullPath);

        // Handle range requests
        $request = request();
        $range = $request->header('Range');

        if (!$range) {
            // No range request, send entire file
            return response()->file($fullPath, [
                'Content-Type' => $mimeType,
                'Content-Length' => $size,
                'Accept-Ranges' => 'bytes',
            ]);
        }

        // Parse range header
        $range = str_replace('bytes=', '', $range);
        $parts = explode('-', $range);
        $start = intval($parts[0]);
        $end = isset($parts[1]) && $parts[1] !== '' ? intval($parts[1]) : $size - 1;

        if ($start > $end || $start >= $size || $end >= $size) {
            abort(416, 'Requested range not satisfiable');
        }

        $length = $end - $start + 1;

        // Stream the file in chunks
        $stream = fopen($fullPath, 'rb');
        fseek($stream, $start);

        $response = new StreamedResponse(function() use ($stream, $length) {
            $chunkSize = 1024 * 256; // 256KB chunks
            $bytesRead = 0;

            while (!feof($stream) && $bytesRead < $length) {
                $bytesToRead = min($chunkSize, $length - $bytesRead);
                echo fread($stream, $bytesToRead);
                flush();
                $bytesRead += $bytesToRead;
            }

            fclose($stream);
        }, 206);

        $response->headers->set('Content-Type', $mimeType);
        $response->headers->set('Content-Length', $length);
        $response->headers->set('Content-Range', "bytes {$start}-{$end}/{$size}");
        $response->headers->set('Accept-Ranges', 'bytes');
        $response->headers->set('Cache-Control', 'public, max-age=3600');

        return $response;
    }

    /**
     * Get video progress for current user
     */
    public function getProgress(Multimedia $multimedia)
    {
        $user = auth()->user();
        $level = $multimedia->level;
        $program = $level->program;

        // Students must be enrolled and have level unlocked
        if ($user->isStudent()) {
            if (!$program->hasStudent($user)) {
                abort(403, 'No estás inscrito en este programa.');
            }

            if (!$level->isUnlockedFor($user)) {
                abort(403, 'Este nivel no está desbloqueado para ti.');
            }
        }

        $progress = VideoProgress::where('user_id', $user->id)
            ->where('multimedia_id', $multimedia->id)
            ->first();

        return response()->json([
            'current_time' => $progress ? $progress->current_time : 0,
            'completed' => $progress ? $progress->completed : false,
            'progress_percentage' => $progress ? $progress->getProgressPercentage() : 0,
        ]);
    }

    /**
     * Update video progress for current user
     */
    public function updateProgress(Request $request, Multimedia $multimedia)
    {
        $validated = $request->validate([
            'current_time' => 'required|integer|min:0',
            'duration' => 'nullable|integer|min:0',
        ]);

        $user = auth()->user();
        $level = $multimedia->level;
        $program = $level->program;

        // Students must be enrolled and have level unlocked
        if ($user->isStudent()) {
            if (!$program->hasStudent($user)) {
                abort(403, 'No estás inscrito en este programa.');
            }

            if (!$level->isUnlockedFor($user)) {
                abort(403, 'Este nivel no está desbloqueado para ti.');
            }
        }

        // Calculate if video is completed (95% watched counts as completed)
        $completed = false;
        if (isset($validated['duration']) && $validated['duration'] > 0) {
            $percentage = ($validated['current_time'] / $validated['duration']) * 100;
            $completed = $percentage >= 95;
        }

        $progress = VideoProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'multimedia_id' => $multimedia->id,
            ],
            [
                'current_time' => $validated['current_time'],
                'duration' => $validated['duration'] ?? null,
                'completed' => $completed,
            ]
        );

        return response()->json([
            'success' => true,
            'current_time' => $progress->current_time,
            'completed' => $progress->completed,
            'progress_percentage' => $progress->getProgressPercentage(),
        ]);
    }

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
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
