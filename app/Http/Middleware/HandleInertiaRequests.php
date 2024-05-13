<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [

            'auth.user' => fn() => auth()->user()
                ? $request->user()->only('id', 'name', 'email')
                : null,

            // 'auth.user.roles' => fn() => auth()->user()
            //     ? $request->user()->getRoleNames()
            //     : null,

            // 'auth.user.permissions' => fn() => auth()->user()
            //     ? $request->user()->getAllPermissions()->pluck(['name'])
            //     : null,

            'flash' => [
                'success' => $request->session()->get('success', null),
                'danger' => $request->session()->get('danger', null),
            ],
        ]);
    }

}
