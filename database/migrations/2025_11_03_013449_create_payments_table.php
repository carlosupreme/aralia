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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('program_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->date('due_date')->nullable(); // Set after first payment
            $table->timestamp('payment_date')->nullable(); // When student uploaded receipt
            $table->timestamp('paid_at')->nullable(); // When admin confirmed payment
            $table->enum('status', ['pending', 'confirmed', 'rejected'])->default('pending');
            $table->string('receipt_url')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->softDeletes(); // Immutable logs with soft deletes
            $table->timestamps();

            // Index for queries
            $table->index(['user_id', 'program_id', 'status']);
            $table->index('due_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
