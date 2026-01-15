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
        Schema::table('staff_roles', function (Blueprint $table) {
            //
            $table->enum('role', ['admin', 'superadmin', 'staff', 'grade_head', 'systemic_head'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enum', function (Blueprint $table) {
            //
        });
    }
};
