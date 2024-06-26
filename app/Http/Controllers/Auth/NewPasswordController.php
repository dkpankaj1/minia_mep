<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Log; // Import Log facade
use Illuminate\Support\Str;
use Inertia\Inertia;

class NewPasswordController extends Controller
{
    public function create(Request $request, string $token)
    {
        Log::channel('custom')->info('NewPasswordController@create: Rendering password reset form', ['email' => $request->email]);
        return Inertia::render('Auth/ResetPassword', ['token' => $token, 'email' => $request->email]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        Log::channel('custom')->info('NewPasswordController@store: Attempting to reset password', ['email' => $request->email]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            Log::channel('custom')->info('NewPasswordController@store: Password reset successful', ['email' => $request->email]);
            return redirect()->route('login')->with('success', __($status));
        } else {
            Log::channel('custom')->error('NewPasswordController@store: Failed to reset password', ['email' => $request->email, 'status' => $status]);
            return back()->withErrors(['email' => [__($status)]]);
        }
    }
}
