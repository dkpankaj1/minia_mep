<?php

namespace App\Helpers;

use App\Models\ProductWarehouse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exceptions\ProductWarehouseNotFoundException;

class StockManager
{
    public static function stockIn(int $productId, int $warehouseId, float $quantity): bool
    {
        try {
            $productWarehouse = self::getProductWarehouse($productId, $warehouseId);

            DB::transaction(function () use ($productWarehouse, $quantity) {
                $productWarehouse->quantity += $quantity;
                $productWarehouse->save();
            });

            Log::info("Stock added", ['product_id' => $productId, 'warehouse_id' => $warehouseId, 'quantity' => $quantity]);

            return true;
        } catch (\Exception $e) {
            Log::error("Failed to add stock", ['error' => $e->getMessage()]);
            throw $e;
        }
    }


    public static function stockOut(int $productId, int $warehouseId, float $quantity): bool
    {
        try {
            $productWarehouse = self::getProductWarehouse($productId, $warehouseId);

            DB::transaction(function () use ($productWarehouse, $quantity) {
                $productWarehouse->quantity -= $quantity;
                $productWarehouse->save();
            });

            Log::info("Stock removed", ['product_id' => $productId, 'warehouse_id' => $warehouseId, 'quantity' => $quantity]);

            return true;

        } catch (\Exception $e) {
            Log::error("Failed to remove stock", ['error' => $e->getMessage()]);
            throw $e;
        }
    }


    protected static function getProductWarehouse(int $productId, int $warehouseId): ProductWarehouse
    {
        try {
            return ProductWarehouse::firstOrCreate(
                ['product_id' => $productId, 'warehouse_id' => $warehouseId],
                ['quantity' => 0]
            );
        } catch (ModelNotFoundException $e) {
            throw new ProductWarehouseNotFoundException();
        }
    }
}
