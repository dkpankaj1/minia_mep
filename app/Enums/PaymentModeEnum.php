<?php

namespace App\Enums;

enum PaymentModeEnum: string
{
    case CASH = 'cash';
    case ONLINE = 'online';
    case BANK_TRANSFER = 'bank_transfer';
    case UPI = 'upi';
    case CHECKS = 'checks';
    case OTHER = 'other';
}