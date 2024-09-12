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
        Schema::create('stock_issue_item_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_issue_item_id')->cascadeOnDelete();
            $table->foreignId('product_batch_id');
            $table->double('quantity')->default(0.00);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_issue_item_batches');
    }
};
