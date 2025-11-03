<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentReminder extends Model
{
    protected $fillable = [
        'days_before',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'days_before' => 'integer',
    ];

    /**
     * Scope for active reminders
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
