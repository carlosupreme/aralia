<?php
// database/migrations/xxxx_create_students_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Datos específicos de estudiantes
            $table->date('date_of_birth')->nullable();
            $table->string('team')->nullable();
            $table->string('sport')->nullable();
            $table->string('country')->nullable();
            $table->string('city')->nullable();

            // Relación con padre/tutor
            $table->string('parent')->nullable();
            $table->string('parent_name')->nullable();

            // Datos de progreso
            $table->integer('total_points')->default(0);
            $table->integer('current_level')->default(1);
            $table->json('achievements')->nullable();

            // Suscripción
            $table->enum('subscription_status', ['active', 'inactive', 'trial'])->default('trial');
            $table->date('subscription_expires_at')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
