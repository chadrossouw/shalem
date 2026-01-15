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
        Schema::table('document_statuses', function (Blueprint $table) {
            //
            $table->enum('status', ['pending', 'approved', 'rejected', 'changes_requested', 'forwarded'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_status', function (Blueprint $table) {
            //
        });
    }
};
