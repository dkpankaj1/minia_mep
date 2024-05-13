<?php

namespace Database\Seeders;

use App\Models\PermissionGroup;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $group = PermissionGroup::create(['name' => "role management"]);
        Permission::create(['name' => 'role.index', 'permission_group_id' => $group->id]);
        Permission::create(['name' => 'role.create', 'permission_group_id' => $group->id]);
        Permission::create(['name' => 'role.edit', 'permission_group_id' => $group->id]);
        Permission::create(['name' => 'role.delete', 'permission_group_id' => $group->id]);
    }
}
