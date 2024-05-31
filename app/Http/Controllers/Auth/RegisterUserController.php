<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterUserRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

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

            // Auth::login($user);

            // return redirect(route('dashboard', absolute: false))->with('success', 'register successful');

            return redirect()->route('login')->with('success', "user registration success.");

        } catch (\Exception $e) {
            return redirect()->route('login')->with('danger', $e->getMessage());
        }
    }
}
