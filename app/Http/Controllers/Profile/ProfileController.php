<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Traits\ImageManager;
use Illuminate\Http\Request;
use Inertia\Inertia;


class ProfileController extends Controller
{
    use ImageManager;
    public function edit(Request $request)
    {
        return Inertia::render('Profile/Profile', [
            'user' => auth()->user()
        ]);
    }


    public function update(UpdateProfileRequest $request)
    {

        try {
            // Fill the user's model with the validated data
            $request->user()->fill([
                'name' => $request->name,
                'email' => $request->email,
            ]);

            // If the email has changed, reset email verification status
            if ($request->user()->isDirty('email')) {
                $request->user()->email_verified_at = null;
            }

            if ($request->has('avatar')) {
                $image = $request->file('avatar');
                $request->user()->update([
                    'avatar' => $this->base64FromRequest($image->getRealPath(),200,200)
                ]);
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
