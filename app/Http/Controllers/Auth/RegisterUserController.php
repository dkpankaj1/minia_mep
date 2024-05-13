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

            Auth::login($user);

            return redirect(route('dashboard', absolute: false))->with('success', 'register successful');

        } catch (\Exception $e) {
            return redirect()->route('login')->with('danger', $e->getMessage());
        }
    }
}
