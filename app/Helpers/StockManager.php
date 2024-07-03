<?php

namespace App\Helpers;

use App\Models\ProductWarehouse;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exceptions\ProductWarehouseNotFoundException;

class StockManager
{
    public static function stockIn(ProductWarehouse $productWarehouse, float $quantity): bool
    {
        try {

            DB::transaction(function () use ($productWarehouse, $quantity) {
                $productWarehouse->quantity += $quantity;
                $productWarehouse->save();
            });

            Log::channel('custom')->info("Stock added", ['product_id' => $productWarehouse->product_id, 'warehouse_id' => $productWarehouse->warehouse_id, 'quantity' => $quantity]);

            return true;
        } catch (\Exception $e) {
            Log::channel('custom')->error("Failed to add stock", ['error' => $e->getMessage()]);
            throw $e;
        }
    }


    public static function stockOut(ProductWarehouse $productWarehouse, float $quantity): bool
    {
        try {

            DB::transaction(function () use ($productWarehouse, $quantity) {
                $productWarehouse->quantity -= $quantity;
                $productWarehouse->save();
            });

            Log::channel('custom')->info("Stock removed", ['product_id' => $productWarehouse->product_id, 'warehouse_id' => $productWarehouse->warehouse_id, 'quantity' => $quantity]);
            return true;

        } catch (\Exception $e) {
            Log::channel('custom')->error("Failed to remove stock", ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    public static function getAllStock()
    {
        // Eager load relationships and apply scopes to filter product warehouses and batches
        $warehouses = Warehouse::with([
            'productWarehouse' => function ($query) {
                $query->withPositiveQuantity()->with([
                    'product',
                    'batches' => function ($batchQuery) {
                        $batchQuery->notExpired()->withPositiveQuantity();
                    }
                ]);
            }
        ])->get();

        $stock = $warehouses->map(function ($warehouse) {
            $productWarehouseStock = $warehouse->productWarehouse->filter(function ($productWarehouse) {

                $product = $productWarehouse->product;

                // Calculate available stock
                $available = $product->is_batch
                    ? $productWarehouse->batches->sum('quantity')
                    : $productWarehouse->quantity;

                // Exclude products with zero availability
                return $available > 0;
            })->map(function ($productWarehouse) {

                $product = $productWarehouse->product;

                // Calculate available stock again for filtered products
                $available = $product->is_batch
                    ? $productWarehouse->batches->sum('quantity')
                    : $productWarehouse->quantity;

                return [
                    'id' => $productWarehouse->id,
                    'product_id' => $product->id,
                    'code' => $product->code,
                    'name' => $product->name,
                    'available' => $available,
                    'unit' => $product->unit ?? null,
                    'sale_unit' => $product->saleUnit ?? null,
                    'available_unit' => $product->getAvailableUnits(),
                    'price' => $product->price,
                    'tax_method' => $product->tax_method,
                    'net_tax' => $product->net_tax,
                    'is_batch' => $product->is_batch,
                    'batch' => $product->is_batch ? $productWarehouse->batches : null,
                ];
            });

            return [
                'id' => $warehouse->id,
                'name' => $warehouse->name,
                'stock' => $productWarehouseStock
            ];
        });

        return $stock;
    }

    public static function getWarehouseStock(Warehouse $warehouse)
    {
        $productWarehouseStock = $warehouse->productWarehouse->filter(function ($productWarehouse) {

            $product = $productWarehouse->product;

            // Calculate available stock
            $available = $product->is_batch
                ? $productWarehouse->batches->sum('quantity')
                : $productWarehouse->quantity;

            // Exclude products with zero availability
            return $available > 0;
        })->map(function ($productWarehouse) {

            $product = $productWarehouse->product;

            // Calculate available stock again for filtered products
            $available = $product->is_batch
                ? $productWarehouse->batches->sum('quantity')
                : $productWarehouse->quantity;

            return [
                'id' => $productWarehouse->id,
                'product_id' => $product->id,
                'code' => $product->code,
                'name' => $product->name,
                'available' => $available,
                'unit' => $product->unit ?? null,
                'sale_unit' => $product->saleUnit ?? null,
                'available_unit' => $product->getAvailableUnits(),
                'price' => $product->price,
                'tax_method' => $product->tax_method,
                'net_tax' => $product->net_tax,
                'is_batch' => $product->is_batch,
                'batch' => $product->is_batch ? $productWarehouse->batches : null,
            ];
        });

        return [
            'id' => $warehouse->id,
            'name' => $warehouse->name,
            'stock' => $productWarehouseStock
        ];
    }

    public static function getProductWarehouse(int $productId, int $warehouseId): ProductWarehouse
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
