<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    
    public function up(): void
    {
        Schema::create('payment_purchases', function (Blueprint $table) {
            $table->id();
            $table->string('date');
            $table->foreignId('purchase_id')->cascadeOnDelete();
            $table->double('amount')->default(0.0);
            $table->string('transaction_id')->nullable();
            $table->string('pmt_mode');
            $table->string('pmt_status');
            $table->string('note')->nullable();
            $table->foreignId('user_id');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_purchases');
    }
};
