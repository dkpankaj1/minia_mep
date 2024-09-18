<?php

namespace App\Enums;

enum ProductionOrderEnum: string
{
    case PLANNED = "planned";
    case PROCESSING = "processing";
    case IN_PROGRESS = "in_progress";
    case REJECT = "reject";
    case COMPLETE = "complete";
}