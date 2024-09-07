<?php

namespace App\Enums;

enum ProductionOrderEnum: string
{
    case PLANNED = "planned";
    case PROCESSING = "processing";
    case COMPLETE = "complete";
}