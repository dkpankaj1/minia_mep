<?php
namespace App\Http\Controllers\Purchase;

use App\Enums\DiscountTypeEnum;
use App\Models\Unit;

class PurchaseHelper
{
    public static function calculateTotalTax($item)
    {
        return $item['tax_method'] !== "0" ? (doubleval($item['net_unit_cost']) * doubleval($item['tax_rate']) / 100) : 0;
    }

    public static function calculateSubTotal($item)
    {
        $unit = Unit::where('id', $item['purchase_unit_id'])->first();
        $quantity = doubleval($item['quantity']);
        $net_unit_cost = doubleval($item['net_unit_cost']) / $unit->operator_value;
        $discount = doubleval($item['discount']);
        $tax_rate = doubleval($item['tax_rate']);

        if ($item['tax_method'] == "0") {
            if ($item['discount_method'] == "0") {
                return $quantity * ($net_unit_cost - $discount);
            } else {
                return $quantity * ($net_unit_cost - ($net_unit_cost * $discount / 100));
            }
        } else {
            if ($item['discount_method'] == "0") {
                return $quantity * (($net_unit_cost + ($net_unit_cost * $tax_rate / 100)) - $discount);
            } else {
                return $quantity * (($net_unit_cost + ($net_unit_cost * ($tax_rate / 100))) - ($net_unit_cost * $discount / 100));
            }
        }

    }
    public static function grandTotal($request)
    {
        $grandSubTotal = self::calculateGrandSubTotal($request->purchase_item, $request->order_tax);

        if ($request->discount_method == DiscountTypeEnum::FIXED) {
            return $grandSubTotal + $request->other_cost + $request->shipping_cost + ($grandSubTotal * ($request->order_tax / 100)) - $request->discount;
        } else {
            return $grandSubTotal + $request->other_cost + $request->shipping_cost + ($grandSubTotal * ($request->order_tax / 100)) - ($grandSubTotal * $request->discount / 100);
        }
    }

    public static function calculateGrandSubTotal($purchaseItems, $orderTax)
    {
        $grandTotal = 0;
        foreach ($purchaseItems as $item) {
            $grandTotal += self::calculateSubTotal($item);
        }
        return $grandTotal;
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
