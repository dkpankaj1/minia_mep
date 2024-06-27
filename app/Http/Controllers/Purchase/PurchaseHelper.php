<?php
namespace App\Http\Controllers\Purchase;

use App\Enums\DiscountTypeEnum;
use App\Models\Unit;

class PurchaseHelper
{
    public static function calculateItemTotalTax($item)
    {
        return $item['tax_method'] !== "0" ? (doubleval($item['net_unit_cost']) * doubleval($item['tax_rate']) / 100) : 0;
    }

    public static function calculateItemSubTotal($item)
    {
        $unit = Unit::find($item['purchase_unit_id']);
        $net_unit_cost = (double) $item['net_unit_cost'];
        $quantity = $unit->operator == "/" ? (double) $item['quantity'] / $unit->operator_value : (double) $item['quantity'] * $unit->operator_value;
        $discount = (double) $item['discount'];
        $discount_method = (double) $item['discount_method'];
        $tax_rate = (double) $item['tax_rate'];
        $tax_method = (double) $item['tax_method'];

        $discounted_price = $discount_method == "0" ? $net_unit_cost - $discount : $net_unit_cost * (1 - $discount / 100);
        $taxed_price = $tax_method == "0" ? $discounted_price : $discounted_price * (1 + $tax_rate / 100);

        return ($quantity * $taxed_price);
    }

    public static function calculateGrandSubTotal($purchaseItems)
    {
        $grandTotal = 0;
        foreach ($purchaseItems as $item) {
            $grandTotal += self::calculateItemSubTotal($item);
        }
        return $grandTotal;
    }

    public static function grandTotal($request)
    {
        $grandSubTotal = self::calculateGrandSubTotal($request->purchase_item);
        $discountedSubTotal = $request->discount_method == DiscountTypeEnum::FIXED ? $grandSubTotal - $request->discount : $grandSubTotal - ($grandSubTotal * $request->discount / 100);
        return $discountedSubTotal + $request->other_cost + $request->shipping_cost + ($discountedSubTotal * ($request->order_tax / 100));

    }


    public static function calculateQuantity($quantity, $unit)
    {
        if ($unit) {
            return ($unit->operator == '/')
                ? $quantity / $unit->operator_value
                : $quantity * $unit->operator_value;
        }
        return $quantity;
    }

}
