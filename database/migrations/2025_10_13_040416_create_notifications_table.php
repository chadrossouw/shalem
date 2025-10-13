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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('user_id');
            $table->foreignUuid('sender_id');
            $table->string('type');
            $table->longText('message');
            $table->string('subject');
            $table->boolean('is_read')->default(false);
            $table->date('sent_at');
            $table->date('read_at')->nullable();
            $table->json('actions')->nullable();
            $table->foreignId('avatar_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
