<?php

namespace App\Http\Requests\BillOfMaterial;

use App\Models\BillOfMaterial;
use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBOMRequest extends FormRequest
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
            'code' => ['required', Rule::unique(BillOfMaterial::class, 'code')],
            'product' => ['required', Rule::exists(Product::class, 'id')],
            'materials' => ['required', 'array'],
        ];
    }
}
