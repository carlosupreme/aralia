<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VideoProgress extends Model
{
    protected $table = 'video_progress';

    protected $fillable = [
        'user_id',
        'multimedia_id',
        'current_time',
        'duration',
        'completed',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'current_time' => 'integer',
        'duration' => 'integer',
    ];

    /**
     * Get the user who has this progress
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the multimedia item this progress is for
     */
    public function multimedia(): BelongsTo
    {
        return $this->belongsTo(Multimedia::class);
    }

    /**
     * Get progress percentage
     */
    public function getProgressPercentage(): int
    {
        if (!$this->duration || $this->duration === 0) {
            return 0;
        }

        return (int) min(100, ($this->current_time / $this->duration) * 100);
    }
}
