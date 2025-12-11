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
        Schema::table('badges', function (Blueprint $table) {
            //
            $table->dropColumn('criteria');
        });
        Schema::table('goals', function (Blueprint $table) {
            //
            $table->dropColumn('criteria');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('badges_and_goals', function (Blueprint $table) {
            //
        });
    }
};
