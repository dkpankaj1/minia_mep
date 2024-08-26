<?php

namespace App\Http\Requests\Payment\Purchase;

use App\Enums\PaymentModeEnum;
use App\Models\Purchase;
use App\Models\Supplier;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePurchasePaymentRequest extends FormRequest
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
            "date" => ['required'],
            "supplier_id" => ['required', Rule::exists(Supplier::class, 'id')],
            "purchase_id" => ['required', Rule::exists(Purchase::class, 'id')],
            "amount" => ['required', 'numeric'],
            "payment_mode" => ['required',Rule::in(PaymentModeEnum::cases())],
        ];
    }
}
