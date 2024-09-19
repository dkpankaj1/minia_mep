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
        Schema::create('stock_receives', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->string('date');
            $table->foreignId('production_order_id');
            $table->double('quantity');
            $table->foreignId('unit_id');
            $table->string('batch')->nullable();
            $table->string('expiration')->nullable();
            $table->foreignId(column: 'product_batch_id')->nullable();
            $table->string('status')->default('generate');
            $table->string('remark')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_receives');
    }
};
