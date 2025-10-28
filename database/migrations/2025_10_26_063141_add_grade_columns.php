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
        //
        Schema::table('documents', function (Blueprint $table) {
            //
            $table->string('grade')->nullable()->before('created_at');
        });

        //Same for user_badges, user_points and user_goals tables
        Schema::table('user_badges', function (Blueprint $table) {
            //
            $table->string('grade')->nullable()->before('created_at');
        });

        Schema::table('user_points', function (Blueprint $table) {
            //
            $table->string('grade')->nullable()->before('created_at');
        });

        Schema::table('user_goals', function (Blueprint $table) {
            //
            $table->string('grade')->nullable()->before('created_at');
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
