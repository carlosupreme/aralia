<?php

namespace App\Console\Commands;

use App\Models\Payment;
use App\Models\PaymentReminder;
use App\Models\Notification;
use Illuminate\Console\Command;

class SendPaymentReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payments:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send payment reminders to students based on configured reminder settings';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Get active reminder configurations
        $reminders = PaymentReminder::where('is_active', true)->get();

        if ($reminders->isEmpty()) {
            $this->info('No active payment reminders configured.');
            return 0;
        }

        $totalSent = 0;

        foreach ($reminders as $reminder) {
            $daysBefore = $reminder->days_before;

            // Get confirmed payments that are due in X days
            $targetDate = now()->addDays($daysBefore)->startOfDay();

            $payments = Payment::where('status', Payment::STATUS_CONFIRMED)
                ->whereDate('due_date', $targetDate)
                ->with(['user', 'program'])
                ->get();

            foreach ($payments as $payment) {
                // Check if we haven't already sent a reminder for this payment at this interval
                $existingReminder = Notification::where('user_id', $payment->user_id)
                    ->where('type', Notification::TYPE_PAYMENT_REMINDER)
                    ->whereJsonContains('data->payment_id', $payment->id)
                    ->whereJsonContains('data->days_until_due', $daysBefore)
                    ->exists();

                if (!$existingReminder) {
                    Notification::createPaymentReminder($payment->user, $payment, $daysBefore);
                    $totalSent++;

                    $this->info("Sent reminder to {$payment->user->name} for {$payment->program->name} ({$daysBefore} days before)");
                }
            }
        }

        $this->info("Total reminders sent: {$totalSent}");
        return 0;
    }
}
