<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Level extends Model
{
    protected $fillable = [
        'name',
        'description',
        'program_id',
        'order_index',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the program this level belongs to
     */
    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    /**
     * Get all multimedia resources for this level
     */
    public function multimedia(): HasMany
    {
        return $this->hasMany(Multimedia::class)->orderBy('order_index');
    }

    /**
     * Get active multimedia resources for this level
     */
    public function activeMultimedia(): HasMany
    {
        return $this->hasMany(Multimedia::class)->where('is_active', true)->orderBy('order_index');
    }

    /**
     * Get users who have unlocked this level
     */
    public function unlockedUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'level_user')
            ->withPivot('is_unlocked', 'is_completed', 'unlocked_at', 'completed_at')
            ->withTimestamps();
    }

    /**
     * Check if a user has unlocked this level
     */
    public function isUnlockedFor(User $user): bool
    {
        return $this->unlockedUsers()
            ->where('user_id', $user->id)
            ->wherePivot('is_unlocked', true)
            ->exists();
    }

    /**
     * Check if a user has completed this level
     */
    public function isCompletedFor(User $user): bool
    {
        return $this->unlockedUsers()
            ->where('user_id', $user->id)
            ->wherePivot('is_completed', true)
            ->exists();
    }

    /**
     * Unlock this level for a user
     */
    public function unlockFor(User $user): void
    {
        $this->unlockedUsers()->syncWithoutDetaching([
            $user->id => [
                'is_unlocked' => true,
                'unlocked_at' => now(),
            ]
        ]);
    }

    /**
     * Mark this level as completed for a user
     */
    public function completeFor(User $user): void
    {
        $this->unlockedUsers()->syncWithoutDetaching([
            $user->id => [
                'is_completed' => true,
                'completed_at' => now(),
            ]
        ]);
    }

    /**
     * Get the next level in the program
     */
    public function nextLevel(): ?Level
    {
        return $this->program->levels()
            ->where('order_index', '>', $this->order_index)
            ->orderBy('order_index')
            ->first();
    }

    /**
     * Get the previous level in the program
     */
    public function previousLevel(): ?Level
    {
        return $this->program->levels()
            ->where('order_index', '<', $this->order_index)
            ->orderBy('order_index', 'desc')
            ->first();
    }
}
