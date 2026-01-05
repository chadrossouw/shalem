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
        Schema::create('user_goals_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_goal_id');
            $table->foreignId('criteria_id');
            $table->integer('progress_value')->default(0);
            $table->integer('target_value')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
