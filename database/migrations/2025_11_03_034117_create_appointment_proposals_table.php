<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('appointment_proposals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // who is proposing
            $table->json('proposed_dates'); // array of [{date, time}]
            $table->text('message')->nullable(); // reason for reschedule
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->foreignId('accepted_date_index')->nullable(); // which proposed date was accepted
            $table->timestamps();

            $table->index(['appointment_id', 'created_at']);
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointment_proposals');
    }
};
