<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('app_name');
            $table->binary('logo');
            $table->binary('favicon');
            $table->string('license');
            $table->unsignedBigInteger('default_currency')->nullable();

            $table->timestamps();

            $table->foreign('default_currency')->references("id")->on('currencies')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
