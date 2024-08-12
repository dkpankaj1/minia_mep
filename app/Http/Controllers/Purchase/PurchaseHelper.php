<?php
namespace App\Http\Controllers\Purchase;

use App\Enums\DiscountTypeEnum;
use App\Models\Unit;

class PurchaseHelper
{
    public static function calculateItemTotalTax($item)
    {
        return $item['tax_method'] !== "0" ? (double) $item['net_unit_cost'] * (double) $item['tax_rate'] / 100 : 0;
    }

    public static function calculateItemSubTotal($item)
    {
        $unit = Unit::find($item['purchase_unit_id']);
        $netUnitCost = (double) $item['net_unit_cost'];
        $quantity = self::calculateQuantity((double) $item['quantity'], $unit);
        $discount = (double) $item['discount'];
        $discountMethod = (double) $item['discount_method'];
        $taxRate = (double) $item['tax_rate'];
        $taxMethod = (double) $item['tax_method'];

        $discountedPrice = $discountMethod == 0 ? $netUnitCost - $discount : $netUnitCost * (1 - $discount / 100);

        $taxedPrice = $taxMethod == 0 ? $discountedPrice : $discountedPrice * (1 + $taxRate / 100);
        
        return $quantity * $taxedPrice;
    }

    public static function calculateGrandSubTotal($purchaseItems)
    {
        return array_reduce($purchaseItems, function ($total, $item) {
            return $total + self::calculateItemSubTotal($item);
        }, 0);
    }

    public static function totalTax($purchaseItem, $discount, $discountMethod, $orderTax)
    {
        $grandSubTotal = self::calculateGrandSubTotal($purchaseItem);
        $discountedSubTotal = self::applyDiscount($grandSubTotal, $discount, $discountMethod);
        return $discountedSubTotal * ($orderTax / 100);
    }


    public static function grandTotal($purchaseItem, $discount, $discountMethod, $otherCost, $shippingCost, $orderTax)
    {
        $grandSubTotal = self::calculateGrandSubTotal($purchaseItem);
        $discountedSubTotal = self::applyDiscount($grandSubTotal, $discount, $discountMethod);
        return $discountedSubTotal + $otherCost + $shippingCost + ($discountedSubTotal * ($orderTax / 100));
    }


    public static function calculateQuantity($quantity, $unit)
    {
        return $unit ? ($unit->operator === '/' ? $quantity / $unit->operator_value : $quantity * $unit->operator_value) : $quantity;
    }

    private static function applyDiscount($amount, $discount, $discountMethod)
    {
        return $discountMethod === DiscountTypeEnum::FIXED ? $amount - $discount : $amount * (1 - $discount / 100);
    }
}
