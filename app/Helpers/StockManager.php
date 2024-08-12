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

    public static function getAllWarehouseStock()
    {
        // Eager load relationships and apply scopes to filter product warehouses and batches
        $warehouses = Warehouse::with([
            'productWarehouse' => function ($query) {
                $query->withPositiveQuantity()->with([
                    'product' => function ($productQuery) {
                        $productQuery->where('is_active', 1);
                    },
                    'batches' => function ($batchQuery) {
                        $batchQuery->notExpired()->withPositiveQuantity();
                    }
                ]);
            }
        ])->get();

        $stocks = $warehouses->map(function ($warehouse) {

            $productWarehouseStock = $warehouse->productWarehouse->filter(function ($productWarehouse) {
                return $productWarehouse->quantity > 0;
            })->map(function ($productWarehouse) {
                $product = $productWarehouse->product;
                if ($productWarehouse->batches->isNotEmpty()) {
                    return $productWarehouse->batches->filter(function ($batch) {
                        return $batch->quantity > 0;
                    })->map(function ($batch) use ($product, $productWarehouse) {
                        return (object) [
                            'id' => $productWarehouse->id,
                            'product_id' => $product->id,
                            'name' => $product->name,
                            'code' => $product->code,
                            'available' => $productWarehouse->quantity,
                            'sale_unit' => $product->saleUnit ?? null,
                            'units' => $product->getAvailableUnits(),
                            'price' => $product->price,
                            'tax_method' => $product->tax_method,
                            'net_tax' => $product->net_tax,
                            'is_batch' => $product->is_batch,
                            'batch_id' => $batch->id,
                            'batch_number' => $batch->batch,
                            'expiration' => $batch->expiration,
                        ];
                    });
                } else {
                    return (object) [
                        'id' => $productWarehouse->id,
                        'product_id' => $product->id,
                        'name' => $product->name,
                        'code' => $product->code,
                        'available' => $productWarehouse->quantity,
                        'unit' => $product->unit ?? null,
                        'sale_unit' => $product->saleUnit ?? null,
                        'units' => $product->getAvailableUnits(),
                        'price' => $product->price,
                        'tax_method' => $product->tax_method,
                        'net_tax' => $product->net_tax,
                        'is_batch' => $product->is_batch,
                        'batch_id' => null,
                        'batch_number' => null,
                        'expiration' => null,
                    ];
                }

            })->flatten()->values();

            return (object) [
                'id' => $warehouse->id,
                'name' => $warehouse->name,
                'stocks' => $productWarehouseStock
            ];
        });

        return $stocks;
    }

    public static function getWarehouseStock($warehouseId)
    {
        // Eager load relationships and apply scopes to filter product warehouses and batches
        $warehouse = Warehouse::with([
            'productWarehouse' => function ($query) {
                $query->withPositiveQuantity()->with([
                    'product' => function ($productQuery) {
                        $productQuery->where('is_active', 1);
                    },
                    'batches' => function ($batchQuery) {
                        $batchQuery->notExpired()->withPositiveQuantity();
                    }
                ]);
            }
        ])->find($warehouseId);

        $productWarehouseStock = $warehouse->productWarehouse->filter(function ($productWarehouse) {
            // Exclude products with zero availability
            return $productWarehouse->quantity > 0;
        })->map(function ($productWarehouse) {
            $product = $productWarehouse->product;

            return [
                'id' => $productWarehouse->id,
                'product_id' => $product->id,
                'name' => $product->name,
                'code' => $product->code,
                'available' => $productWarehouse->quantity,
                'unit' => $product->unit ?? null,
                'sale_unit' => $product->saleUnit ?? null,
                'units' => $product->getAvailableUnits(),
                'price' => $product->price,
                'tax_method' => $product->tax_method,
                'net_tax' => $product->net_tax,
                'is_batch' => $product->is_batch,
                'batches' => $productWarehouse->batches,
            ];
        })->values();

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
