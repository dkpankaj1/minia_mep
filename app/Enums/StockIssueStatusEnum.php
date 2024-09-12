<?php

namespace App\Enums;

enum StockIssueStatusEnum: string
{
    case GENERATE = "generate";
    case COMPLETE = "complete";
}