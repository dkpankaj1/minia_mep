<?php

use App\Enums\TaxMethodEnums;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sale_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sale_id');
            $table->foreignId('product_warehouse_id');
            $table->foreignId('product_batch_id')->nullable();
            $table->unsignedBigInteger('sale_unit_id');
            $table->double('net_unit_price')->default(0);
            $table->double('calculate_rate')->default(0);
            $table->double('quantity')->default(0.00);
            $table->tinyInteger('discount_method');
            $table->double('discount')->default(0);
            $table->tinyInteger('tax_method')->default(TaxMethodEnums::INCLUSIVE);
            $table->double('tax_rate')->default(0);
            $table->double('sub_total')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('sale_id')->references('id')->on('sales')->cascadeOnDelete();
            $table->foreign('sale_unit_id')->references('id')->on('units');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sale_items');
    }
};
