<?php

namespace App\Http\Requests\StockIssue;

use App\Enums\StockIssueStatusEnum;
use App\Models\StockIssue;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStockIssueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'code' => ['required', Rule::unique(StockIssue::class, 'code')],
            'status' => ['required', Rule::in(StockIssueStatusEnum::cases())],
            'production_order' => ['required', 'integer'],
            'items' => ['required', 'array', 'min:1'],
        ];
    }
}
