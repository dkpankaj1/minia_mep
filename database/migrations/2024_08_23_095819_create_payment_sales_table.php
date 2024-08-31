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
        Schema::create('payment_sales', function (Blueprint $table) {
            $table->id();
            $table->string('date');
            $table->foreignId('sale_id');
            $table->double('amount')->default(0.0);
            $table->string('transaction_id')->nullable();
            $table->string('pmt_mode');
            $table->string('pmt_status');
            $table->string('note')->nullable();
            $table->foreignId('user_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_sales');
    }
};