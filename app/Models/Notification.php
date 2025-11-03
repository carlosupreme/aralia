<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    const TYPE_PAYMENT_RECEIVED = 'payment_received';
    const TYPE_PAYMENT_APPROVED = 'payment_approved';
    const TYPE_PAYMENT_REJECTED = 'payment_rejected';
    const TYPE_PAYMENT_REMINDER = 'payment_reminder';

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'data',
        'is_read',
        'read_at',
    ];

    protected $casts = [
        'data' => 'array',
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    /**
     * Get the user that owns the notification
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(): void
    {
        $this->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    /**
     * Scope for unread notifications
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope for read notifications
     */
    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }

    /**
     * Create a payment received notification for admin
     */
    public static function createPaymentReceived(User $admin, Payment $payment): self
    {
        return self::create([
            'user_id' => $admin->id,
            'type' => self::TYPE_PAYMENT_RECEIVED,
            'title' => 'Nuevo Pago Recibido',
            'message' => "El estudiante {$payment->user->name} ha enviado un comprobante de pago para {$payment->program->name}",
            'data' => [
                'payment_id' => $payment->id,
                'program_id' => $payment->program_id,
                'student_id' => $payment->user_id,
                'amount' => $payment->amount,
            ],
        ]);
    }

    /**
     * Create a payment approved notification for student
     */
    public static function createPaymentApproved(User $student, Payment $payment): self
    {
        return self::create([
            'user_id' => $student->id,
            'type' => self::TYPE_PAYMENT_APPROVED,
            'title' => 'Pago Confirmado',
            'message' => "Tu pago de \${$payment->amount} para {$payment->program->name} ha sido confirmado. Acceso válido hasta {$payment->due_date->format('d/m/Y')}",
            'data' => [
                'payment_id' => $payment->id,
                'program_id' => $payment->program_id,
                'due_date' => $payment->due_date->format('Y-m-d'),
            ],
        ]);
    }

    /**
     * Create a payment rejected notification for student
     */
    public static function createPaymentRejected(User $student, Payment $payment): self
    {
        return self::create([
            'user_id' => $student->id,
            'type' => self::TYPE_PAYMENT_REJECTED,
            'title' => 'Pago Rechazado',
            'message' => "Tu pago para {$payment->program->name} ha sido rechazado. Razón: {$payment->rejection_reason}",
            'data' => [
                'payment_id' => $payment->id,
                'program_id' => $payment->program_id,
                'rejection_reason' => $payment->rejection_reason,
            ],
        ]);
    }

    /**
     * Create a payment reminder notification
     */
    public static function createPaymentReminder(User $student, Payment $payment, int $daysUntilDue): self
    {
        return self::create([
            'user_id' => $student->id,
            'type' => self::TYPE_PAYMENT_REMINDER,
            'title' => 'Recordatorio de Pago',
            'message' => "Tu pago para {$payment->program->name} vence en {$daysUntilDue} días ({$payment->due_date->format('d/m/Y')}). Asegúrate de renovar tu suscripción.",
            'data' => [
                'payment_id' => $payment->id,
                'program_id' => $payment->program_id,
                'due_date' => $payment->due_date->format('Y-m-d'),
                'days_until_due' => $daysUntilDue,
            ],
        ]);
    }
}
