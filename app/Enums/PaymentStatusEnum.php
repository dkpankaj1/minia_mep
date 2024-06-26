<?php

namespace App\Enums;

enum PaymentStatusEnum {
    public const PENDING  = "pending";
    public const PARTIAL  = "partial";
    public const PAID  = "paid";
}