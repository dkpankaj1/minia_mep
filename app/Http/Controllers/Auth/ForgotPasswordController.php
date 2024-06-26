<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Log; // Import Log facade
use Inertia\Inertia;

class ForgotPasswordController extends Controller
{
    public function create()
    {
        Log::info('ForgotPasswordController@create: Render forget password page');
        return Inertia::render('Auth/ForgetPassword');
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        Log::info('ForgotPasswordController@store: Validation passed', ['email' => $request->email]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            Log::info('ForgotPasswordController@store: Reset link sent', ['status' => $status, 'email' => $request->email]);
            return back()->with(['success' => __($status)]);
        } else {
            Log::error('ForgotPasswordController@store: Failed to send reset link', ['status' => $status, 'email' => $request->email]);
            return back()->withErrors(['email' => __($status)]);
        }
    }
}

