<?php

namespace App\Http\Controllers\Users;

use App\Enums\UserEnum;
use App\Filters\ByName;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\UserStoreRequest;
use App\Http\Requests\User\UserUpdateRequest;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Pipeline;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    use AuthorizationFilter;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorizeOrFail('user.index');

        $users = Pipeline::send(User::query()->with('roles:name'))
            ->through([ByName::class])
            ->thenReturn()
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('User/List', [
            'users' => [
                'collection' => UserResource::collection($users),
                'count' => User::count(),
            ],
            'breadcrumb' => Breadcrumbs::generate('user.index')
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorizeOrFail('user.create');

        return Inertia::render('User/Create', [
            'roles' => Role::whereNotIn('id', [1])->get(),
            'breadcrumb' => Breadcrumbs::generate('user.create')
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserStoreRequest $request)
    {
        $this->authorizeOrFail('user.create');

        try {
            $data = [
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make('password'),
                'phone' => $request->phone,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'country' => $request->country,
                'postal_code' => $request->postal_code,
                'avatar' => UserEnum::DEFAULT_AVATAR,
                'is_active' => $request->is_active,
            ];
            User::create($data)->assignRole($request->user_role);
            return redirect()->route('user.index')->with('success', 'User created.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $this->authorizeOrFail('user.index');

        return Inertia::render('User/Show', [
            'user' => User::with('roles')->where('id', $user->id)->first(),
            'breadcrumb' => Breadcrumbs::generate('user.show',$user)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $this->authorizeOrFail('user.edit');

        return Inertia::render('User/Edit', [
            'user' => User::with('roles')->where('id', $user->id)->first(),
            'roles' => Role::whereNotIn('id', [1])->get(),
            'breadcrumb' => Breadcrumbs::generate('user.edit', $user)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateRequest $request, User $user)
    {
        $this->authorizeOrFail('user.edit');

        try {
            $data = [
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'country' => $request->country,
                'postal_code' => $request->postal_code,
                'avatar' => UserEnum::DEFAULT_AVATAR,
                'is_active' => $request->is_active,
            ];
            if ($request->boolean('password_reset')) {
                $data['password'] = Hash::make('password');
            }

            $user->update($data);
            $user->syncRoles($request->user_role);
            return redirect()->route('user.index')->with('success', 'User updated.');

        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $this->authorizeOrFail('user.delete');

        if (in_array($user->id, [1,Auth::user()->id])) {
            return redirect()->back()->with('danger', "Sorry, the user cannot be deleted.");
        }

        try {
            $user->delete();
            return redirect()->back()->with('success', 'User deleted.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }
}
