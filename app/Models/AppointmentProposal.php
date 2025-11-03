<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AppointmentProposal extends Model
{
    protected $fillable = [
        'appointment_id',
        'user_id',
        'proposed_dates',
        'message',
        'status',
        'accepted_date_index',
    ];

    protected $casts = [
        'proposed_dates' => 'array',
        'accepted_date_index' => 'integer',
    ];

    // Status constants
    const STATUS_PENDING = 'pending';
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_REJECTED = 'rejected';

    // Relationships
    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    public function proposedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Helper methods
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isAccepted(): bool
    {
        return $this->status === self::STATUS_ACCEPTED;
    }

    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

    public function accept(int $dateIndex): void
    {
        $this->update([
            'status' => self::STATUS_ACCEPTED,
            'accepted_date_index' => $dateIndex,
        ]);
    }

    public function reject(): void
    {
        $this->update(['status' => self::STATUS_REJECTED]);
    }

    public function getAcceptedDate(): ?array
    {
        if ($this->isAccepted() && isset($this->proposed_dates[$this->accepted_date_index])) {
            return $this->proposed_dates[$this->accepted_date_index];
        }
        return null;
    }
}
