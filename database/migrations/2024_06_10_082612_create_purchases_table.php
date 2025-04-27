<?php

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('reference')->unique();
            $table->foreignId('finance_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('supplier_id')->constrained()->cascadeOnDelete();
            $table->foreignId('warehouse_id')->constrained()->cascadeOnDelete();
            $table->double('total_cost')->default(0);
            $table->tinyInteger('discount_method');
            $table->double('discount')->default(0);
            $table->string('tax_rate')->default(0);
            $table->double('total_tax')->default(0);
            $table->double('shipping_cost')->default(0);
            $table->double('other_cost')->default(0);
            $table->double('grand_total')->default(0);
            $table->double('paid_amount')->default(0);
            $table->string('order_status')->default(OrderStatusEnum::PENDING);
            $table->string('payment_status')->default(PaymentStatusEnum::PENDING);
            $table->text('note')->nullable();
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
        Schema::dropIfExists('purchases');
    }
};
