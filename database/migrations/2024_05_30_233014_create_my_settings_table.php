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
        Schema::create('my_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->unsignedBigInteger('default_customer')->nullable();
            $table->unsignedBigInteger('default_finance_year')->nullable();

            $table->timestamps();
            
            $table->foreign('default_customer')->references("id")->on('customers')->nullOnDelete();
            $table->foreign('default_finance_year')->references("id")->on('finance_years')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('my_settings');
    }
};
