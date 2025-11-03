<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Program extends Model
{
    protected $fillable = [
        'name',
        'description',
        'psychologist_id',
        'is_active',
        'monthly_price',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'monthly_price' => 'decimal:2',
    ];

    /**
     * Get the psychologist that created this program
     */
    public function psychologist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'psychologist_id');
    }

    /**
     * Get all levels for this program
     */
    public function levels(): HasMany
    {
        return $this->hasMany(Level::class)->orderBy('order_index');
    }

    /**
     * Get active levels for this program
     */
    public function activeLevels(): HasMany
    {
        return $this->hasMany(Level::class)->where('is_active', true)->orderBy('order_index');
    }

    /**
     * Get enrolled students for this program
     */
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'program_user')
            ->withPivot('enrolled_at')
            ->withTimestamps();
    }

    /**
     * Check if a student is enrolled in this program
     */
    public function hasStudent(User $student): bool
    {
        return $this->students()->where('user_id', $student->id)->exists();
    }

    /**
     * Get the first level of this program
     */
    public function firstLevel(): ?Level
    {
        return $this->levels()->orderBy('order_index')->first();
    }

    /**
     * Get all payments for this program
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
