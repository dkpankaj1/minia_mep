<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterUserRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log; // Import Log facade
use Inertia\Inertia;

class RegisterUserController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    public function store(RegisterUserRequest $request)
    {
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
            
            $user->assignRole('user');

            $user->mySetting()->create([
                'user_id' => $user->id,
                'default_customer' => 1,
                'default_finance_year' => 1,
            ]);

            Log::info('RegisterUserController@store: User registered successfully', ['email' => $user->email]);

            return redirect()->route('login')->with('success', 'User registration successful.');

        } catch (\Exception $e) {
            Log::error('RegisterUserController@store: Failed to register user', ['error' => $e->getMessage()]);
            return redirect()->route('login')->with('danger', 'Failed to register user: ' . $e->getMessage());
        }
    }
}
