<?php

namespace App\Listeners;

use App\Events\LoginEvent;
use Illuminate\Support\Facades\DB;

class LoginEventListener
{
    /**
     * Create the event listener.
     */

    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(LoginEvent $event): void
    {
        DB::table('login_histories')->insert([
            'user_id' => $event->user->id,
            'login_time' => now(),
            'ip_address' => $event->ip,
            'user_agent' => $event->userAgent
        ]);
    }
}
