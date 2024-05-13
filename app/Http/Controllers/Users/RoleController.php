<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\RoleStoreRequest;
use App\Http\Requests\User\RoleUpdateRequest;
use App\Models\PermissionGroup;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    use AuthorizationFilter;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorizeOrFail('role.index');
        return Inertia::render('RoleManagement/List', [
            'roles' => Role::whereNotIn('id', [1])->get(),
            'title' => "Role List",
            'breadcrumb' => Breadcrumbs::generate('dashboard')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorizeOrFail('role.create');

        return Inertia::render('RoleManagement/Create', [
            "permissionGroup" => PermissionGroup::with('permissions')->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleStoreRequest $request)
    {
        $this->authorizeOrFail('role.create');

    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        $this->authorizeOrFail('role.index');

        return Inertia::render('RoleManagement/Show', ['role' => $role]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        $this->authorizeOrFail('role.edit');

        return Inertia::render('RoleManagement/Edit', ['role' => $role]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleUpdateRequest $request, Role $role)
    {
        $this->authorizeOrFail('role.edit');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $this->authorizeOrFail('role.delete');
    }
}
