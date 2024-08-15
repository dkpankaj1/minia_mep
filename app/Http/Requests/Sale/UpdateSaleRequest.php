<?php

namespace App\Http\Requests\Sale;

use App\Enums\DiscountTypeEnum;
use App\Enums\OrderStatusEnum;
use App\Enums\TaxMethodEnums;
use App\Models\Customer;
use App\Models\ProductBatch;
use App\Models\Unit;
use App\Models\Warehouse;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSaleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'customer' => ['required', 'integer', "not_in:null", Rule::exists(Customer::class, 'id')],
            'warehouse' => ['required', 'integer', Rule::exists(Warehouse::class, 'id')],
            'order_status' => ['required', Rule::in([OrderStatusEnum::GENERATED, OrderStatusEnum::PENDING, OrderStatusEnum::RECEIVED])],
            'discount_method' => ['required', Rule::in([DiscountTypeEnum::FIXED, DiscountTypeEnum::PERCENTAGE])],
            'discount' => ['required', 'numeric'],
            'order_tax' => ['required', 'numeric', 'min:0', 'max:100'],
            'shipping_cost' => ['required', 'numeric'],
            'other_cost' => ['required', 'numeric'],
            'note' => ['nullable', 'string'],


            'sale_items' => ['required', 'array'],
            'sale_items.*.stock_id' => ['required', 'integer'],
            'sale_items.*.name' => ['required', 'string', 'max:255'],
            'sale_items.*.sale_unit' => ['required', 'array'],
            'sale_items.*.sale_unit.id' => ['required', 'numeric', Rule::exists(Unit::class, 'id')],
            'sale_items.*.quantity' => ['required', 'numeric'],
            'sale_items.*.discount_method' => ['required', Rule::in([DiscountTypeEnum::FIXED, DiscountTypeEnum::PERCENTAGE])],
            'sale_items.*.discount' => ['required', 'numeric'],
            'sale_items.*.tax_method' => ['required', 'numeric', Rule::in([TaxMethodEnums::INCLUSIVE, TaxMethodEnums::EXCLUSIVE])],
            'sale_items.*.tax_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'sale_items.*.is_batch' => ['required_if:sale_items.*.is_batch,1', 'nullable', 'numeric', 'max:255'],
            'sale_items.*.batch_id' => ['required_if:sale_items.*.is_batch,1', 'nullable', 'numeric', 'max:255', Rule::exists(ProductBatch::class, 'id')],
            'sale_items.*.batch_number' => ['required_if:sale_items.*.is_batch,1', 'nullable', 'string', 'max:255'],

        ];
    }
}
