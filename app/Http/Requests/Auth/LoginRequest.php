<?php

namespace App\Http\Requests\Auth;

// use App\Events\LoginEvent;
use App\Events\LoginEvent;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true; // Authorization is handled elsewhere, returning true for simplicity.
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Authenticate the user.
     *
     * @return void
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        // Attempt to authenticate the user with the provided credentials.
        if (!Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            // Throw a validation exception with a message indicating authentication failure.
            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        event(new LoginEvent(Auth::user(),$this->ip(),$this->userAgent()));

        // Clear the rate limiter since the authentication was successful.
        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the request is not rate limited.
     *
     * @return void
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        // Check if the request is rate limited.
        if (!RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        // Fire an event to handle the lockout.
        event(new Lockout($this));

        // Calculate the time remaining until the lockout is lifted.
        $seconds = RateLimiter::availableIn($this->throttleKey());

        // Throw a validation exception with a message indicating the throttle limit is reached.
        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the throttle key for the request.
     *
     * @return string
     */
    public function throttleKey(): string
    {
        // Generate a unique key based on the user's email and IP address.
        return Str::transliterate(Str::lower($this->input('email')) . '|' . $this->ip());
    }
}
