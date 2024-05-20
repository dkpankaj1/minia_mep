<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateProfileRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Show the profile update form.
     *
     * This method renders the profile update page using Inertia.
     * The 'user' data is passed to the view, allowing the form to be populated with the user's information.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function edit(Request $request)
    {
        return Inertia::render('Profile/Profile', [
            'user' => auth()->user()
        ]);
    }

    /**
     * Update the user's profile.
     *
     * This method handles the profile update process. It receives a validated request from
     * UpdateProfileRequest, fills the user's model with the validated data, and checks if the email
     * has been changed. If the email is updated, the email_verified_at field is set to null. The updated
     * profile is then saved to the database. If the update is successful, a success message is flashed to
     * the session. If an exception occurs, an error message is flashed instead.
     *
     * @param  \App\Http\Requests\Profile\UpdateProfileRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdateProfileRequest $request)
    {
        try {
            // Fill the user's model with the validated data
            $request->user()->fill($request->validated());

            // If the email has changed, reset email verification status
            if ($request->user()->isDirty('email')) {
                $request->user()->email_verified_at = null;
            }

            // Save the updated user profile to the database
            $request->user()->save();

            // Redirect back to the profile edit page with a success message
            return redirect()->route('profile.edit')->with('success', 'Profile updated');
        } catch (\Exception $e) {
            // Flash an error message to the session if an exception occurs
            return back()->with('danger', $e->getMessage());
        }
    }
}
