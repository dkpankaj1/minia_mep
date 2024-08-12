<?php

namespace App\Http\Requests\Settings;

use App\Models\Customer;
use App\Models\Warehouse;
use Illuminate\Foundation\Http\FormRequest;
use App\Models\Currency;
use App\Models\FinanceYears;
use Illuminate\Validation\Rule;

class MySettingUpdateRequest extends FormRequest
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
            'default_customer' => ['required', Rule::exists(Customer::class, 'id')],
            'default_finance_year' => ['required', Rule::exists(FinanceYears::class, 'id')],
            'default_warehouse' => ['required', Rule::exists(Warehouse::class, 'id')]
        ];
    }
}
