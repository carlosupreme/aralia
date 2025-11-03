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
        Schema::create('video_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('multimedia_id')->constrained()->onDelete('cascade');
            $table->integer('current_time')->default(0); // in seconds
            $table->integer('duration')->nullable(); // total video duration in seconds
            $table->boolean('completed')->default(false);
            $table->timestamps();

            // Ensure one progress record per user per video
            $table->unique(['user_id', 'multimedia_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_progress');
    }
};
