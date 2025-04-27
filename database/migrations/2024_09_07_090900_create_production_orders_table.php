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
        Schema::create('production_orders', function (Blueprint $table) {
            $table->id();
            $table->string('date');
            $table->string('code')->unique();
            $table->foreignId('bill_of_material_id');
            $table->foreignId('finance_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('warehouse_id')->constrained()->cascadeOnDelete();
            $table->foreignId('work_station_id')->constrained()->cascadeOnDelete();
            $table->double('quantity')->default(0);
            $table->double('cost')->default(0);
            $table->double('other_cost')->default(0);
            $table->string('start_at')->nullable();
            $table->string('end_at')->nullable();
            $table->string('status');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('production_orders');
    }
};
