<?php

namespace App\Http\Requests\User;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UpdateUserRequest extends FormRequest
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
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class, 'email')->ignore($this->user)],
            'phone' => ['required', 'string'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'postal_code' => ['required', 'string', 'max:20'],
        ];

        if ($this->user->id != 1) {
            $rules['user_role'] = ['required', Rule::exists(Role::class, 'name'), Rule::notIn(['super_admin'])];
            $rules['is_active'] = ['required', Rule::in([0, 1])];
        }

        return $rules;
    }

    public function prepareForValidation()
    {
        if ($this->user->id == 1) {
            $this->merge([
                'user_role' => $this->user->roles->pluck('name')->toArray(),
                'is_active' => $this->user->is_active,
            ]);
        }
    }

    /**
     * Prepare data for user update.
     *
     * @param User $user
     * @return array
     */
    public function prepareData(User $user): array
    {
        $data = $this->only([
            'name',
            'email',
            'phone',
            'address',
            'city',
            'state',
            'country',
            'postal_code'
        ]);

        if ($user->id != 1) {
            $data['is_active'] = $this->is_active;

            if ($this->boolean('password_reset')) {
                $data['password'] = Hash::make('password');
            }
        }

        return $data;
    }
}
