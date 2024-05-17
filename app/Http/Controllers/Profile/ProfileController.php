<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateProfileRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit(Request $request)
    {
        return Inertia::render('Profile/Profile', [
            'user' => auth()->user()
        ]);
    }
    public function update(UpdateProfileRequest $request)
    {
        try {
            $request->user()->fill($request->validated());
            
            if ($request->user()->isDirty('email')) {
                $request->user()->email_verified_at = null;
            }
            $request->user()->save();

            return redirect()->route('profile.edit')->with('success', 'profile updated');

        } catch (\Exception $e) {

            return back()->with('danger', $e->getMessage());

        }




    }
}
