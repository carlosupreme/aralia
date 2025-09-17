<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
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
    public function students()
    {
        return $this->hasMany(User::class, 'psychologist_id');
    }

    // Relación para psicólogo asignado (si un estudiante tiene un psicólogo)
    public function psychologist()
    {
        return $this->belongsTo(User::class, 'psychologist_id');
    }

    // Método helper para verificar si es psicólogo
    public function isPsychologist()
    {
        return $this->hasRole('psychologist');
    }

    // Método helper para verificar si es estudiante
    public function isStudent()
    {
        return $this->hasRole('student');
    }
}
