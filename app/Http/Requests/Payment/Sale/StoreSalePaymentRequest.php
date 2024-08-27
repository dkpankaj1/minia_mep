<?php

namespace App\Http\Requests\Payment\Sale;

use App\Enums\PaymentModeEnum;
use App\Models\Customer;
use App\Models\Sale;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSalePaymentRequest extends FormRequest
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
            "customer" => ['required', Rule::exists(Customer::class, 'id')],
            "sale" => ['required', Rule::exists(Sale::class, 'id')],
            "amount" => ['required', 'numeric'],
            "payment_mode" => ['required', Rule::in(PaymentModeEnum::cases())],
        ];
    }

    public function messages():array{
        return [
            'sale.required' => "The Invoice field is required."
        ];
    }
}
