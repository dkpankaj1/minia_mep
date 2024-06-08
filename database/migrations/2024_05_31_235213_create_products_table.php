<?php

use App\Enums\BarcodeTypeEnum;
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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('barcode_symbology');
            $table->unsignedBigInteger('category_id')->index();
            $table->unsignedBigInteger('sub_category_id')->index();
            $table->unsignedBigInteger('brand_id')->index();
            $table->string('name')->index();
            $table->unsignedBigInteger('unit_id')->index();
            $table->unsignedBigInteger('purchase_unit_id')->index();
            $table->unsignedBigInteger('sale_unit_id')->index();
            $table->double('cost')->default(0);
            $table->double('price')->default(0);
            $table->string('tax_method')->default(TaxTypeEnums::INCLUSIVE);
            $table->double('net_tax')->default(0);
            $table->tinyInteger('is_batch')->default(0);
            $table->unsignedInteger('expiration_alert')->nullable();
            $table->unsignedBigInteger('stock_alert')->default(10);
            $table->binary('image')->nullable();
            $table->tinyInteger('is_active')->default(0)->index();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('category_id')->references('id')->on('categories');
            $table->foreign('sub_category_id')->references('id')->on('sub_categories');
            $table->foreign('brand_id')->references('id')->on('brands');
            $table->foreign('unit_id')->references('id')->on('units');
            $table->foreign('purchase_unit_id')->references('id')->on('units');
            $table->foreign('sale_unit_id')->references('id')->on('units');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
