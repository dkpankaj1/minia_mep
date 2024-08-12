<?php

namespace App\Helpers;

use App\Models\Sale;

class Helpers
{
    public static function generateUniqueInvoiceId()
    {
        $latestSale = Sale::latest()->first();
        $nextId = $latestSale ? $latestSale->id : 0;
        do {
            $nextId += 1;
            $invoiceId = 'INV_' . str_pad($nextId, 8, '0', STR_PAD_LEFT);

        } while (Sale::where('invoice_id', $invoiceId)->exists());

        return $invoiceId;
    }
}