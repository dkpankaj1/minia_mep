<?php

namespace App\Http\Controllers\Users;

use App\Filters\ByLimit;
use App\Filters\ByName;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\RoleStoreRequest;
use App\Http\Requests\User\RoleUpdateRequest;
use App\Models\PermissionGroup;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Pipeline;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    use AuthorizationFilter;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorizeOrFail('role.index');

        $roleQuery = Role::query()->whereNotIn('id', [1])->withCount('users');

        $roles = Pipeline::send($roleQuery)->through([
            ByName::class,
        ])
            ->thenReturn()
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('RoleManagement/List', [
            'roles' => [
                'collection' => $roles,
                'count' => $roles->total(),
            ],
            'breadcrumb' => Breadcrumbs::generate('role.index')
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorizeOrFail('role.create');

        return Inertia::render('RoleManagement/Create', [
            "permissionGroup" => PermissionGroup::with('permissions')->get(),
            'breadcrumb' => Breadcrumbs::generate('role.create')

        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleStoreRequest $request)
    {
        $this->authorizeOrFail('role.create');
        try {
            $role = Role::create(['name' => $request->name]);
            $role->syncPermissions($request->selectedPermissions);
            return redirect()->route('role.index')->with('success', 'role created');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        $this->authorizeOrFail('role.index');

        return Inertia::render('RoleManagement/Show', [
            'role' => [
                'resource' => $role,
                'permissionGroup' => PermissionGroup::with('permissions')->get(),
                'rolePermissions' => $role->permissions()->pluck('name'),
                'assignUser' => $role->users
            ],
            'breadcrumb' => Breadcrumbs::generate('role.show',$role)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        $this->authorizeOrFail('role.edit');

        return Inertia::render('RoleManagement/Edit', [
            'permissionGroup' => PermissionGroup::with('permissions')->get(),
            'role' => $role,
            'rolePermissions' => $role->permissions()->pluck('name'),
            'breadcrumb' => Breadcrumbs::generate('role.edit',$role)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleUpdateRequest $request, Role $role)
    {
        $this->authorizeOrFail('role.edit');

        try {
            $role->update(['name' => $request->name]);
            $role->syncPermissions($request->selectedPermissions);
            return redirect()->back()->with('success', 'role updated');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $this->authorizeOrFail('role.delete');
        if (in_array($role->id, [1, 2])) {
            return redirect()->back()->with('danger', "Sorry, the role cannot be deleted.");
        }

        try {
            $role->delete();
            return redirect()->back()->with('success', 'role deleted');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }
}
