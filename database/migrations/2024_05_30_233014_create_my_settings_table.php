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
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('default_customer')->nullable();
            $table->unsignedBigInteger('default_finance_year')->nullable();
            $table->unsignedBigInteger('default_warehouse')->nullable();

            $table->timestamps();            
            $table->softDeletes();
            
            $table->foreign('default_customer')->references("id")->on('customers')->nullOnDelete();
            $table->foreign('default_finance_year')->references("id")->on('finance_years')->nullOnDelete();
            $table->foreign('default_warehouse')->references("id")->on('warehouses')->nullOnDelete();
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
