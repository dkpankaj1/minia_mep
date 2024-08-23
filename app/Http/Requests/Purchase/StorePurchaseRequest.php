<?php

namespace App\Http\Requests\Purchase;

use App\Enums\DiscountTypeEnum;
use App\Enums\OrderStatusEnum;
use App\Enums\TaxMethodEnums;
use App\Models\ProductBatch;
use App\Models\Purchase;
use App\Models\Supplier;
use App\Models\Warehouse;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePurchaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;  // Change this to true to allow the request
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
            'reference' => ['nullable', 'string', 'max:255', Rule::unique(Purchase::class, 'reference')],
            'supplier' => ['required', 'integer', Rule::exists(Supplier::class, 'id')],
            'warehouse' => ['required', 'integer', Rule::exists(Warehouse::class, 'id')],
            'order_status' => ['required', Rule::in([OrderStatusEnum::GENERATED, OrderStatusEnum::PENDING, OrderStatusEnum::RECEIVED])],
            'discount_method' => ['required', Rule::in([DiscountTypeEnum::FIXED, DiscountTypeEnum::PERCENTAGE])],
            'discount' => ['required', 'numeric'],
            'order_tax' => ['required', 'numeric', 'min:0', 'max:100'],
            'shipping_cost' => ['required', 'numeric'],
            'other_cost' => ['required', 'numeric'],
            'note' => ['nullable', 'string'],

            'purchase_item' => ['required', 'array'],
            'purchase_item.*.product_id' => ['required', 'integer'],
            'purchase_item.*.code' => ['required', 'string', 'max:255'],
            'purchase_item.*.name' => ['required', 'string', 'max:255'],
            'purchase_item.*.purchase_unit_id' => ['required', 'integer'],
            'purchase_item.*.net_unit_cost' => ['required', 'numeric'],
            'purchase_item.*.quantity' => ['required', 'numeric'],
            'purchase_item.*.discount_method' => ['required', Rule::in([DiscountTypeEnum::FIXED, DiscountTypeEnum::PERCENTAGE])],
            'purchase_item.*.discount' => ['required', 'numeric'],
            'purchase_item.*.tax_method' => ['required', 'numeric', Rule::in([TaxMethodEnums::INCLUSIVE, TaxMethodEnums::EXCLUSIVE])],
            'purchase_item.*.tax_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'purchase_item.*.is_batch' => ['required', 'boolean'],
            'purchase_item.*.batch' => ['required_if:purchase_item.*.is_batch,1', 'nullable', 'string', 'max:255',Rule::unique(ProductBatch::class, 'batch')],
            'purchase_item.*.expiration' => ['required_if:purchase_item.*.is_batch,1', 'nullable', 'date'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'purchase_item.*.batch.required_if' => 'The batch field is required',
            'purchase_item.*.expiration.required_if' => 'The expiration field is required when',
            'date.required' => 'The date field is required.',
            'supplier.required' => 'The supplier field is required.',
            'warehouse.required' => 'The warehouse field is required.',
            'discount_method.required' => 'The discount method field is required.',
            'paid_amount.required' => 'The paid amount field is required.',
            'status.required' => 'The status field is required.',
            'payment_status.required' => 'The payment status field is required.',
        ];
    }
}
