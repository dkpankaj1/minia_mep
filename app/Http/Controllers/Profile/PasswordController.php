<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdatePasswordRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PasswordController extends Controller
{
    /**
     * Show the password update form.
     *
     * This method renders the password update page using Inertia.
     * The 'user' data is passed to the view, allowing the form to be populated with the user's information.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function edit(Request $request)
    {
        return Inertia::render('Profile/Password', [
            'user' => $request->user()
        ]);
    }

    /**
     * Update the user's password.
     *
     * This method handles the password update process. It receives a validated request from
     * UpdatePasswordRequest, hashes the new password, and updates it in the database. If the
     * update is successful, a success message is flashed to the session. If an exception occurs,
     * an error message is flashed instead.
     *
     * @param  \App\Http\Requests\Profile\UpdatePasswordRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdatePasswordRequest $request)
    {
        try {
            // Update the user's password in the database
            $request->user()->update([
                'password' => Hash::make($request->password),
            ]);

            // Flash a success message to the session
            return back()->with('success', 'Password updated');
        } catch (\Exception $e) {
            // Flash an error message to the session if an exception occurs
            return back()->with('danger', $e->getMessage());
        }
    }
}
