<?php
// app/Models/Student.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'date_of_birth',
        'team',
        'sport',
        'country',
        'city',
        'parent',
        'parent_name',
        'total_points',
        'current_level',
        'achievements',
        'subscription_status',
        'subscription_expires_at',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'achievements' => 'array',
        'subscription_expires_at' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
