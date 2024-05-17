<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdatePasswordRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PasswordController extends Controller
{
    public function edit(Request $request)
    {
        return Inertia::render('Profile/Password', [
            'user' => $request->user
        ]);

    }
    public function update(UpdatePasswordRequest $request)
    {
        try {

            $request->user()->update([
                'password' => Hash::make($request->password),
            ]);

            return back()->with('success', 'password updated');

        } catch (\Exception $e) {

            return back()->with('danger', $e->getMessage());

        }

    }
}
