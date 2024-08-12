<?php

namespace App\Http\Controllers\Sale;

use App\Models\Customer;
use App\Models\ProductWarehouse;
use App\Models\Unit;

class SaleHelper
{


    public static function itemSubTotal($saleItem, $calculateRate)
    {
        $saleUnit = Unit::where('id', $saleItem['sale_unit']['id'])->first();
        $product = ProductWarehouse::where('id', $saleItem['stock_id'])->first()->product;

        $quantity = $saleUnit->operator == '/'
            ? $saleItem['quantity'] / $saleUnit->operator_value
            : $saleItem['quantity'] * $saleUnit->operator_value;


        $itemPrice = $product->price + ($product->price * ($calculateRate / 100));

        $taxPrice = self::calculateItemTaxPrice($saleItem, $itemPrice);

        $price = $itemPrice + $taxPrice;

        $discountedPrice = self::calculateItemDiscountedPrice($saleItem, $price);

        return $discountedPrice * $quantity;

    }

    public static function calculateItemDiscountedPrice($saleItem, $price)
    {
        return $saleItem['discount_method'] === 0
            ? $price - (double) $saleItem['discount']
            : $price - ($price * ((double) $saleItem['discount'] / 100));
    }

    public static function calculateItemTaxPrice($saleItem, $itemPrice): float
    {
        return $saleItem['tax_method'] !== 0
            ? (double) $itemPrice * ((double) $saleItem['tax_rate'] / 100)
            : 0;
    }

    public static function calculateSubTotal($saleItems, $calculateRate)
    {
        return array_reduce($saleItems, function ($total, $saleItem) use ($calculateRate) {
            return $total + self::itemSubTotal($saleItem, $calculateRate);
        }, 0);
    }

}

