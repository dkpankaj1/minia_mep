<?php

use App\Enums\TaxMethodEnums;
use App\Enums\TaxTypeEnums;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('purchase_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_id');
            $table->foreignId('product_id');
            $table->unsignedBigInteger('purchase_unit_id');
            $table->double('net_unit_cost')->default(0);
            $table->double('quantity')->default(0.00);
            $table->tinyInteger('discount_method');
            $table->double('discount')->default(0);
            $table->tinyInteger('tax_method')->default(TaxMethodEnums::INCLUSIVE);
            $table->double('tax_rate')->default(0);
            $table->double('total_tax')->default(0);
            $table->double('sub_total')->default(0);
            $table->foreignId('product_batch_id')->nullable();
            $table->timestamps();
            $table->foreign('purchase_unit_id')->references('id')->on('units');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_items');
    }
};
