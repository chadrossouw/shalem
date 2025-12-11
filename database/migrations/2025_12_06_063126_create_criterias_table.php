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
        Schema::create('criterias', function (Blueprint $table) {
            $table->id();
            $table->text('description')->nullable();
            $table->enum('type', ['goal', 'badge']);
            $table->string('pillar')->nullable();
            $table->string('document_points')->nullable();
            $table->enum('document_type', ['internal', 'external'])->nullable();
            $table->string('attendance')->nullable();
            $table->string('merits')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('criterias');
    }
};
