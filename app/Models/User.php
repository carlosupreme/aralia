<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relación para estudiantes (si un psicólogo puede tener múltiples estudiantes)
    public function students(): HasMany
    {
        return $this->hasMany(User::class, 'psychologist_id');
    }

    // Relación para psicólogo asignado (si un estudiante tiene un psicólogo)
    public function psychologist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'psychologist_id');
    }

    // Programas creados por el psicólogo
    public function createdPrograms(): HasMany
    {
        return $this->hasMany(Program::class, 'psychologist_id');
    }

    // Programas en los que está inscrito el estudiante
    public function enrolledPrograms(): BelongsToMany
    {
        return $this->belongsToMany(Program::class, 'program_user')
            ->withPivot('enrolled_at')
            ->withTimestamps();
    }

    // Niveles desbloqueados por el estudiante
    public function unlockedLevels(): BelongsToMany
    {
        return $this->belongsToMany(Level::class, 'level_user')
            ->withPivot('is_unlocked', 'is_completed', 'unlocked_at', 'completed_at')
            ->withTimestamps();
    }

    // Método helper para verificar si es psicólogo
    public function isPsychologist(): bool
    {
        return $this->hasRole('psychologist');
    }

    // Método helper para verificar si es estudiante
    public function isStudent(): bool
    {
        return $this->hasRole('student');
    }

    // Verificar si el usuario tiene acceso a un nivel
    public function hasAccessToLevel(Level $level): bool
    {
        return $this->unlockedLevels()
            ->where('level_id', $level->id)
            ->wherePivot('is_unlocked', true)
            ->exists();
    }

    // Inscribir al usuario en un programa
    public function enrollInProgram(Program $program): void
    {
        $this->enrolledPrograms()->attach($program->id, [
            'enrolled_at' => now(),
        ]);
    }
}
