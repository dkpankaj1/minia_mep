<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use App\Models\SubCategory;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Warehouse;
use App\Models\WorkStation;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(PermissionsSeeder::class);
        $this->call(DefaultRoleSeeder::class);
        $this->call(FinanceYearSeeder::class);
        $this->call(CurrencySeeder::class);
        $this->call(UnitSeeder::class);
        $this->call(CompanySettingSeeder::class);
        $this->call(SystemSettingSeeder::class);

        $this->call(DefaultCustomerSeeder::class);
        $this->call(DefaultSupplierSeeder::class);




        // ================ default seeder :: BEGIN ===================


        Brand::create([
            'name' => "Dell",
            'description' => "No Description",
            'is_active' => 1
        ]);

        Brand::create([
            'name' => "Zebronic",
            'description' => "No Description",
            'is_active' => 1
        ]);

        Brand::create([
            'name' => "NoBrand",
            'description' => "No Description",
            'is_active' => 1
        ]);

        $category1 = Category::create([
            'name' => 'Finish Material',
            'description' => 'No description',
        ]);

        $category2 = Category::create([
            'name' => 'Raw Material',
            'description' => 'No description',
        ]);

        SubCategory::create([
            "name" => 'Gadget ',
            "description" => "No Description",
            "category_id" => $category1->id,
        ]);
        SubCategory::create([
            "name" => 'Grocery ',
            "description" => "No Description",
            "category_id" => $category1->id,
        ]);

        SubCategory::create([
            "name" => 'Mother Board',
            "description" => "No Description",
            "category_id" => $category2->id,
        ]);

        WorkStation::create([
            'name' => 'Default Workstation',
            'description' => "default workstation",
            'status' => 1
        ]);

        Warehouse::create([
            'name' => 'Default Warehouse',
            'email' => 'default_email@email.com',
            'phone' => '9919823355',
            'address' => 'Hata',
            'city' => 'Hata',
            'state' => 'U.P.',
            'postal_code' => '274149',
            'country' => 'india',
            'is_active' => 1
        ]);

        Warehouse::create([
            'name' => 'New Warehouse',
            'email' => 'warehouse_2@email.com',
            'phone' => '9919823355',
            'address' => 'Hata',
            'city' => 'Hata',
            'state' => 'U.P.',
            'postal_code' => '274149',
            'country' => 'india',
            'is_active' => 1
        ]);



        $this->call(DefaultUsersSeeder::class);


        Customer::factory()->count(5)->create();


        // Product::create(
        //     [
        //         'code' => 'PROD000001',
        //         'barcode_symbology' => "C128",
        //         'category_id' => 1,
        //         'sub_category_id' => 1,
        //         'brand_id' => 1,
        //         'name' => "Rice",
        //         'unit_id' => 1,
        //         'purchase_unit_id' => 1,
        //         'sale_unit_id' => 1,
        //         'cost' => 40,
        //         'price' => 60,
        //         'tax_method' => 0,
        //         'net_tax' => 0,
        //         'is_batch' => true,
        //         'stock_alert' => 30,
        //         'is_active' => true,
        //         'description' => fake()->paragraph,
        //         'expiration_alert' => 30
        //     ]
        // );

        // Product::create(
        //     [
        //         'code' => 'PROD000002',
        //         'barcode_symbology' => "C128",
        //         'category_id' => 1,
        //         'sub_category_id' => 1,
        //         'brand_id' => 1,
        //         'name' => "CPU",
        //         'unit_id' => 3,
        //         'purchase_unit_id' => 3,
        //         'sale_unit_id' => 3,
        //         'cost' => 50,
        //         'price' => 70,
        //         'tax_method' => 0,
        //         'net_tax' => 0,
        //         'is_batch' => false,
        //         'stock_alert' => 30,
        //         'is_active' => true,
        //         'description' => fake()->paragraph,
        //         'expiration_alert' => 0
        //     ]
        // );

        // Product::create(
        //     [
        //         'code' => 'PROD000003',
        //         'barcode_symbology' => "C128",
        //         'category_id' => 2,
        //         'sub_category_id' => 3,
        //         'brand_id' => 1,
        //         'name' => "RAM",
        //         'unit_id' => 3,
        //         'purchase_unit_id' => 3,
        //         'sale_unit_id' => 3,
        //         'cost' => 50,
        //         'price' => 70,
        //         'tax_method' => 0,
        //         'net_tax' => 0,
        //         'is_batch' => false,
        //         'stock_alert' => 30,
        //         'is_active' => true,
        //         'description' => fake()->paragraph,
        //         'expiration_alert' => 0
        //     ]
        // );

        // Product::create(
        //     [
        //         'code' => 'PROD000004',
        //         'barcode_symbology' => "C128",
        //         'category_id' => 2,
        //         'sub_category_id' => 3,
        //         'brand_id' => 1,
        //         'name' => "SMPS",
        //         'unit_id' => 3,
        //         'purchase_unit_id' => 3,
        //         'sale_unit_id' => 3,
        //         'cost' => 50,
        //         'price' => 70,
        //         'tax_method' => 0,
        //         'net_tax' => 0,
        //         'is_batch' => false,
        //         'stock_alert' => 30,
        //         'is_active' => true,
        //         'description' => fake()->paragraph,
        //         'expiration_alert' => 0
        //     ]
        // );

        // Product::create(
        //     [
        //         'code' => 'PROD000005',
        //         'barcode_symbology' => "C128",
        //         'category_id' => 2,
        //         'sub_category_id' => 3,
        //         'brand_id' => 1,
        //         'name' => "Cabinet",
        //         'unit_id' => 3,
        //         'purchase_unit_id' => 3,
        //         'sale_unit_id' => 3,
        //         'cost' => 50,
        //         'price' => 70,
        //         'tax_method' => 0,
        //         'net_tax' => 0,
        //         'is_batch' => false,
        //         'stock_alert' => 30,
        //         'is_active' => true,
        //         'description' => fake()->paragraph,
        //         'expiration_alert' => 0
        //     ]
        // );

        // Product::create(
        //     [
        //         'code' => 'PROD000006',
        //         'barcode_symbology' => "C128",
        //         'category_id' => 2,
        //         'sub_category_id' => 3,
        //         'brand_id' => 1,
        //         'name' => "HDD",
        //         'unit_id' => 3,
        //         'purchase_unit_id' => 3,
        //         'sale_unit_id' => 3,
        //         'cost' => 50,
        //         'price' => 70,
        //         'tax_method' => 0,
        //         'net_tax' => 0,
        //         'is_batch' => false,
        //         'stock_alert' => 30,
        //         'is_active' => true,
        //         'description' => fake()->paragraph,
        //         'expiration_alert' => 0
        //     ]
        // );

        // Product::create(
        //     [
        //         'code' => 'PROD000007',
        //         'barcode_symbology' => "C128",
        //         'category_id' => 2,
        //         'sub_category_id' => 3,
        //         'brand_id' => 1,
        //         'name' => "CPU Fan",
        //         'unit_id' => 3,
        //         'purchase_unit_id' => 3,
        //         'sale_unit_id' => 3,
        //         'cost' => 50,
        //         'price' => 70,
        //         'tax_method' => 0,
        //         'net_tax' => 0,
        //         'is_batch' => false,
        //         'stock_alert' => 30,
        //         'is_active' => true,
        //         'description' => fake()->paragraph,
        //         'expiration_alert' => 0
        //     ]
        // );


        // ================ default seeder :: Enf =====================

    }
}
