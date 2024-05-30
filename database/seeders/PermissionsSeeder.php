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
        
        $brandGroup = PermissionGroup::create(['name' => "Brand Management"]);
        Permission::create(['name' => 'brand.index', 'permission_group_id' => $brandGroup->id]);
        Permission::create(['name' => 'brand.create', 'permission_group_id' => $brandGroup->id]);
        Permission::create(['name' => 'brand.edit', 'permission_group_id' => $brandGroup->id]);
        Permission::create(['name' => 'brand.delete', 'permission_group_id' => $brandGroup->id]);

        $companyGroup = PermissionGroup::create(['name' => "Company Management"]);
        Permission::create(['name' => 'company.index', 'permission_group_id' => $companyGroup->id]);
        Permission::create(['name' => 'company.edit', 'permission_group_id' => $companyGroup->id]);

        $currencyGroup = PermissionGroup::create(['name' => "Currency Management"]);
        Permission::create(['name' => 'currency.index', 'permission_group_id' => $currencyGroup->id]);
        Permission::create(['name' => 'currency.create', 'permission_group_id' => $currencyGroup->id]);
        Permission::create(['name' => 'currency.edit', 'permission_group_id' => $currencyGroup->id]);
        Permission::create(['name' => 'currency.delete', 'permission_group_id' => $currencyGroup->id]);

        $customerManagementGroup = PermissionGroup::create(['name' => "Customer Management"]);
        Permission::create(['name' => 'customer.index', 'permission_group_id' => $customerManagementGroup->id]);
        Permission::create(['name' => 'customer.create', 'permission_group_id' => $customerManagementGroup->id]);
        Permission::create(['name' => 'customer.edit', 'permission_group_id' => $customerManagementGroup->id]);
        Permission::create(['name' => 'customer.delete', 'permission_group_id' => $customerManagementGroup->id]);

        $customerGroupGroup = PermissionGroup::create(['name' => "Customer Group Management"]); 
        Permission::create(['name' => 'customer-group.index', 'permission_group_id' => $customerGroupGroup->id]);
        Permission::create(['name' => 'customer-group.create', 'permission_group_id' => $customerGroupGroup->id]);
        Permission::create(['name' => 'customer-group.edit', 'permission_group_id' => $customerGroupGroup->id]);
        Permission::create(['name' => 'customer-group.delete', 'permission_group_id' => $customerGroupGroup->id]);

        $FinanceYearGroup = PermissionGroup::create(['name' => "Finance Years Management"]);
        Permission::create(['name' => 'finance-years.index', 'permission_group_id' => $FinanceYearGroup->id]);
        Permission::create(['name' => 'finance-years.create', 'permission_group_id' => $FinanceYearGroup->id]);
        Permission::create(['name' => 'finance-years.edit', 'permission_group_id' => $FinanceYearGroup->id]);
        Permission::create(['name' => 'finance-years.delete', 'permission_group_id' => $FinanceYearGroup->id]);

        $roleGroup = PermissionGroup::create(['name' => "Role management"]);
        Permission::create(['name' => 'role.index', 'permission_group_id' => $roleGroup->id]);
        Permission::create(['name' => 'role.create', 'permission_group_id' => $roleGroup->id]);
        Permission::create(['name' => 'role.edit', 'permission_group_id' => $roleGroup->id]);
        Permission::create(['name' => 'role.delete', 'permission_group_id' => $roleGroup->id]);

        $systemsSettingGroup = PermissionGroup::create(['name' => "System Setting"]);
        Permission::create(['name' => 'systemSetting.index', 'permission_group_id' => $systemsSettingGroup->id]);
        Permission::create(['name' => 'systemSetting.edit', 'permission_group_id' => $systemsSettingGroup->id]);

        $supplierGroup = PermissionGroup::create(['name' => "Supplier Management"]);
        Permission::create(['name' => 'supplier.index', 'permission_group_id' => $supplierGroup->id]);
        Permission::create(['name' => 'supplier.create', 'permission_group_id' => $supplierGroup->id]);
        Permission::create(['name' => 'supplier.edit', 'permission_group_id' => $supplierGroup->id]);
        Permission::create(['name' => 'supplier.delete', 'permission_group_id' => $supplierGroup->id]);

        $UnitGroup = PermissionGroup::create(['name' => "Unit Management"]);
        Permission::create(['name' => 'unit.index', 'permission_group_id' => $UnitGroup->id]);
        Permission::create(['name' => 'unit.create', 'permission_group_id' => $UnitGroup->id]);
        Permission::create(['name' => 'unit.edit', 'permission_group_id' => $UnitGroup->id]);
        Permission::create(['name' => 'unit.delete', 'permission_group_id' => $UnitGroup->id]);

        $userGroup = PermissionGroup::create(['name' => "User management"]);
        Permission::create(['name' => 'user.index', 'permission_group_id' => $userGroup->id]);
        Permission::create(['name' => 'user.create', 'permission_group_id' => $userGroup->id]);
        Permission::create(['name' => 'user.edit', 'permission_group_id' => $userGroup->id]);
        Permission::create(['name' => 'user.delete', 'permission_group_id' => $userGroup->id]);

        $warehouseGroup = PermissionGroup::create(['name' => "Warehouse Management"]);
        Permission::create(['name' => 'warehouse.index', 'permission_group_id' => $warehouseGroup->id]);
        Permission::create(['name' => 'warehouse.create', 'permission_group_id' => $warehouseGroup->id]);
        Permission::create(['name' => 'warehouse.edit', 'permission_group_id' => $warehouseGroup->id]);
        Permission::create(['name' => 'warehouse.delete', 'permission_group_id' => $warehouseGroup->id]);

    }

}
