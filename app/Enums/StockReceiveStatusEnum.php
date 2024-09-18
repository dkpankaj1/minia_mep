<?php

namespace App\Enums;

enum StockReceiveStatusEnum: string
{
    case GENERATE = "generate";
    case REJECT = "reject";
    case COMPLETE = "complete";
}