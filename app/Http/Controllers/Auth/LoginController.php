<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // Import Log facade
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class LoginController extends Controller
{
    /**
     * Show the login form.
     *
     * @return \Inertia\Response
     */
    public function create(Request $request)
    {
        Log::channel('custom')->info('LoginController@create: Render login form',['IP' => $request->ip()]);
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle an authentication attempt.
     *
     * @param  \App\Http\Requests\Auth\LoginRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(LoginRequest $request)
    {

        // Attempt to authenticate the user.
        $request->authenticate();

        // Regenerate the session ID to prevent session fixation attacks.
        $request->session()->regenerate();

        Log::channel('custom')->info('LoginController@store: User authenticated and session regenerated', ['email' => $request->email]);

        // Redirect the user to their intended location after successful login.
        return Redirect::intended('/dashboard');
    }

    /**
     * Handle user logout.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Request $request)
    {
        $userEmail = Auth::guard('web')->user()->email; // Get the email of the user who is logging out

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        Log::channel('custom')->info('LoginController@destroy: User logged out and session invalidated', ['email' => $userEmail]);

        return redirect('/');
    }
}
