<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Multimedia extends Model
{
    protected $table = 'multimedia';

    protected $fillable = [
        'name',
        'description',
        'url',
        'type',
        'size',
        'duration',
        'level_id',
        'order_index',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Available multimedia types
     */
    public const TYPES = [
        'video' => 'Video',
        'pdf' => 'PDF',
        'image' => 'Imagen',
        'text' => 'Texto',
        'audio' => 'Audio',
        'document' => 'Documento',
    ];

    /**
     * Get the level this multimedia belongs to
     */
    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    /**
     * Get the program this multimedia belongs to through level
     */
    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class, 'program_id');
    }

    /**
     * Get the type label
     */
    public function getTypeLabel(): string
    {
        return self::TYPES[$this->type] ?? $this->type;
    }

    /**
     * Check if multimedia is a video type
     */
    public function isVideo(): bool
    {
        return $this->type === 'video';
    }

    /**
     * Check if multimedia is an image type
     */
    public function isImage(): bool
    {
        return $this->type === 'image';
    }

    /**
     * Check if multimedia is a document type
     */
    public function isDocument(): bool
    {
        return in_array($this->type, ['pdf', 'document']);
    }

    /**
     * Check if multimedia is audio type
     */
    public function isAudio(): bool
    {
        return $this->type === 'audio';
    }

    /**
     * Format file size for display
     */
    public function getFormattedSize(): ?string
    {
        if (!$this->size) {
            return null;
        }

        $bytes = (int) $this->size;

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
}
