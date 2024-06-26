<?php

namespace Database\Seeders;

use App\Models\PermissionGroup;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'Brand Management' => ['brand.index', 'brand.create', 'brand.edit', 'brand.delete'],
            'Category Management' => ['category.index', 'category.create', 'category.edit', 'category.delete'],
            'Company Management' => ['company.index', 'company.edit'],
            'Currency Management' => ['currency.index', 'currency.create', 'currency.edit', 'currency.delete'],
            'Customer Group Management' => ['customer-group.index', 'customer-group.create', 'customer-group.edit', 'customer-group.delete'],
            'Customer Management' => ['customer.index', 'customer.create', 'customer.edit', 'customer.delete'],
            'Finance Years Management' => ['finance-years.index', 'finance-years.create', 'finance-years.edit', 'finance-years.delete'],
            'Product management' => ['product.index', 'product.create', 'product.edit', 'product.delete'],
            'Purchase management' => ['purchase.index', 'purchase.create', 'purchase.edit', 'purchase.delete'],
            'Role management' => ['role.index', 'role.create', 'role.edit', 'role.delete'],
            'SubCategory Management' => ['sub-category.index', 'sub-category.create', 'sub-category.edit', 'sub-category.delete'],
            'Supplier Management' => ['supplier.index', 'supplier.create', 'supplier.edit', 'supplier.delete'],
            'System Setting' => ['systemSetting.index', 'systemSetting.edit'],
            'Unit Management' => ['unit.index', 'unit.create', 'unit.edit', 'unit.delete'],
            'User management' => ['user.index', 'user.create', 'user.edit', 'user.delete'],
            'Warehouse Management' => ['warehouse.index', 'warehouse.create', 'warehouse.edit', 'warehouse.delete'],
        ];

        foreach ($permissions as $groupName => $groupPermissions) {
            $group = PermissionGroup::create(['name' => $groupName]);
            foreach ($groupPermissions as $permission) {
                Permission::create(['name' => $permission, 'permission_group_id' => $group->id]);
            }
        }
    }


}
