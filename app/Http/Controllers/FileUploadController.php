<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadController extends Controller
{
    /**
     * Upload a multimedia file
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:102400', // 100MB max
            'type' => 'required|in:video,pdf,image,text,audio,document',
        ]);

        $file = $request->file('file');
        $type = $request->input('type');

        // Validate file type based on multimedia type
        $this->validateFileType($file, $type);

        // Generate unique filename
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $filename = Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) . '_' . time() . '.' . $extension;

        // Store file in appropriate directory
        $directory = 'multimedia/' . $type . 's';
        $path = $file->storeAs($directory, $filename, 'public');

        // Get file info
        $fileSize = $file->getSize();
        $mimeType = $file->getMimeType();

        // Generate public URL
        $url = Storage::url($path);

        return response()->json([
            'success' => true,
            'data' => [
                'url' => $url,
                'path' => $path,
                'filename' => $filename,
                'original_name' => $originalName,
                'size' => $this->formatFileSize($fileSize),
                'size_bytes' => $fileSize,
                'mime_type' => $mimeType,
                'type' => $type,
                'duration' => $this->getMediaDuration($path, $type),
            ]
        ]);
    }

    /**
     * Delete an uploaded file
     */
    public function delete(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        $path = $request->input('path');

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);

            return response()->json([
                'success' => true,
                'message' => 'Archivo eliminado exitosamente'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Archivo no encontrado'
        ], 404);
    }

    /**
     * Get file information
     */
    public function info(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        $path = $request->input('path');

        if (!Storage::disk('public')->exists($path)) {
            return response()->json([
                'success' => false,
                'message' => 'Archivo no encontrado'
            ], 404);
        }

        $fileSize = Storage::disk('public')->size($path);
        $lastModified = Storage::disk('public')->lastModified($path);

        return response()->json([
            'success' => true,
            'data' => [
                'path' => $path,
                'url' => Storage::url($path),
                'size' => $this->formatFileSize($fileSize),
                'size_bytes' => $fileSize,
                'last_modified' => date('Y-m-d H:i:s', $lastModified),
                'exists' => true,
            ]
        ]);
    }

    /**
     * Validate file type based on multimedia type
     */
    private function validateFileType($file, $type)
    {
        $mimeType = $file->getMimeType();

        $allowedTypes = [
            'video' => ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'],
            'audio' => ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/webm'],
            'image' => ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
            'pdf' => ['application/pdf'],
            'document' => [
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'text/plain'
            ],
            'text' => ['text/plain', 'text/markdown', 'text/html'],
        ];

        if (!isset($allowedTypes[$type]) || !in_array($mimeType, $allowedTypes[$type])) {
            abort(422, "Tipo de archivo no permitido para el tipo '{$type}'. Tipos permitidos: " . implode(', ', $allowedTypes[$type] ?? []));
        }
    }

    /**
     * Format file size for human reading
     */
    private function formatFileSize($bytes)
    {
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        } else {
            return $bytes . ' bytes';
        }
    }

    /**
     * Get media duration using getID3
     */
    private function getMediaDuration($path, $type)
    {
        if (!in_array($type, ['video', 'audio'])) {
            return null;
        }

        try {
            $getID3 = new \getID3;
            $fullPath = storage_path('app/public/' . $path);

            if (!file_exists($fullPath)) {
                return null;
            }

            $fileInfo = $getID3->analyze($fullPath);

            if (isset($fileInfo['playtime_seconds'])) {
                $seconds = (int) $fileInfo['playtime_seconds'];
                $minutes = floor($seconds / 60);
                $remainingSeconds = $seconds % 60;

                return sprintf('%d:%02d', $minutes, $remainingSeconds);
            }
        } catch (\Exception $e) {
            \Log::warning('Failed to extract media duration: ' . $e->getMessage());
        }

        return null;
    }
}
