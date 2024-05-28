<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class SystemSettingUpdateRequest extends FormRequest
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
            "app_name" => ['required', 'string', 'max:255'],
            "logo" => ['nullable', 'image', 'mimes:jpeg,jpg', 'max:1024'],
            "favicon" => ['nullable', 'image', 'mimes:jpeg,jpg', 'max:512'],
            'license' => ['required', 'string', 'max:255'],
        ];
    }

    public function messages()
    {
        return [
            'app_name.required' => 'The application name is required.',
            'logo.required' => 'The logo is required.',
            'logo.image' => 'The logo must be an image.',
            'favicon.required' => 'The favicon is required.',
            'favicon.image' => 'The favicon must be an image.',
            'license.required' => 'The license is required.',
        ];
    }

}
