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

    /**
     * Get all levels accessible to the user in a program
     * A level is accessible if:
     * - It's unlocked for the user, OR
     * - Any level after it is unlocked (meaning all previous levels are accessible)
     */
    public function getAccessibleLevelsForProgram(Program $program): array
    {
        // Get all unlocked level IDs with their completion status
        $unlockedLevels = $this->unlockedLevels()
            ->wherePivot('is_unlocked', true)
            ->get(['levels.id', 'levels.order_index', 'level_user.is_completed'])
            ->keyBy('id');

        if ($unlockedLevels->isEmpty()) {
            return [];
        }

        // Get all levels in the program sorted by order
        $allLevels = $program->levels()->orderBy('order_index')->get();

        $accessibleLevelIds = [];
        $maxUnlockedOrder = 0;

        // First pass: find the highest unlocked level
        foreach ($unlockedLevels as $level) {
            if ($level->order_index > $maxUnlockedOrder) {
                $maxUnlockedOrder = $level->order_index;
            }
        }

        // Second pass: all levels up to and including the highest unlocked level are accessible
        foreach ($allLevels as $level) {
            if ($level->order_index <= $maxUnlockedOrder) {
                $accessibleLevelIds[] = $level->id;
            }
        }

        return $accessibleLevelIds;
    }

    /**
     * Can the user view a specific level's content?
     * User can view content if the level is accessible (unlocked or previous to an unlocked level)
     */
    public function canViewLevelContent(Level $level): bool
    {
        $accessibleLevels = $this->getAccessibleLevelsForProgram($level->program);
        return in_array($level->id, $accessibleLevels);
    }

    // Inscribir al usuario en un programa
    public function enrollInProgram(Program $program): void
    {
        // Attach the user to the program
        $this->enrolledPrograms()->attach($program->id, [
            'enrolled_at' => now(),
        ]);

        // Automatically unlock the first level (ordered by order_index)
        $firstLevel = $program->levels()
            ->where('is_active', true)
            ->orderBy('order_index')
            ->first();

        if ($firstLevel) {
            $firstLevel->unlockFor($this);
        }
    }

    /**
     * Get all payments made by this user
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get all notifications for this user
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Get all appointments where this user is the psychologist
     */
    public function appointmentsAsPsychologist(): HasMany
    {
        return $this->hasMany(Appointment::class, 'psychologist_id');
    }

    /**
     * Get all appointments where this user is the student
     */
    public function appointmentsAsStudent(): HasMany
    {
        return $this->hasMany(Appointment::class, 'student_id');
    }

    /**
     * Get the latest confirmed payment for a specific program
     */
    public function latestConfirmedPaymentFor(Program $program): ?Payment
    {
        return $this->payments()
            ->where('program_id', $program->id)
            ->where('status', Payment::STATUS_CONFIRMED)
            ->latest('paid_at')
            ->first();
    }

    /**
     * Check if user has access to program content (payment is up to date)
     */
    public function hasAccessToProgram(Program $program): bool
    {
        // Psychologists always have access to their own programs
        if ($this->isPsychologist() && $program->psychologist_id === $this->id) {
            return true;
        }

        // Students need to be enrolled
        if (!$program->hasStudent($this)) {
            return false;
        }

        // Get the latest confirmed payment
        $latestPayment = $this->latestConfirmedPaymentFor($program);

        // If no confirmed payment, no access
        if (!$latestPayment) {
            return false;
        }

        // Check if payment is still valid (not overdue)
        if ($latestPayment->due_date) {
            if (now()->startOfDay()->greaterThan($latestPayment->due_date)) {
                return false; // Payment is overdue
            }
        }

        return true;
    }

    /**
     * Check if user needs to make a payment for a program
     */
    public function needsToPayFor(Program $program): bool
    {
        if (!$program->hasStudent($this)) {
            return false;
        }

        $latestPayment = $this->latestConfirmedPaymentFor($program);

        // No payment yet
        if (!$latestPayment) {
            return true;
        }

        // Check if overdue
        if ($latestPayment->due_date) {
            if (now()->startOfDay()->greaterThan($latestPayment->due_date)) {
                return true;
            }
        }

        return false;
    }
}
