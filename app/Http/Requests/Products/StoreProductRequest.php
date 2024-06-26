<?php

namespace App\Http\Requests\Products;

use App\Enums\BarcodeSymbologyEnum;
use App\Enums\TaxMethodEnums;
use App\Enums\TaxTypeEnums;
use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
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
            'code' => ['required', 'string', 'max:255', Rule::unique(Product::class, 'code')],
            'barcode_symbology' => ['required', Rule::enum(BarcodeSymbologyEnum::class)],
            'category' => ['required', 'integer', 'exists:categories,id'],
            'sub_category' => ['required', 'integer', 'exists:sub_categories,id'],
            'brand' => ['required', 'integer', 'exists:brands,id'],
            'name' => ['required', 'string', 'max:255'],
            'unit' => ['required', 'integer', 'exists:units,id'],
            'purchase_unit' => ['required', 'integer', 'exists:units,id'],
            'sale_unit' => ['required', 'integer', 'exists:units,id'],
            'cost' => ['required', 'numeric'],
            'price' => ['required', 'numeric'],
            'tax_method' => ['required',  Rule::in([TaxMethodEnums::INCLUSIVE,TaxMethodEnums::EXCLUSIVE])],
            'net_tax' => ['required', 'numeric'],
            'is_batch' => ['required', 'boolean'],
            'expiration_alert' => ['nullable', 'integer'],
            'stock_alert' => ['required', 'numeric'],
            'image' => ['nullable', 'mimes:jpeg,jpg,png', 'max:512'],
            'is_active' => ['required', 'integer'],
            'description' => ['nullable', 'string'],
        ];
    }
}
