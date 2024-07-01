<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\SubCategory;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Warehouse;
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

        $this->call(DefaultUsersSeeder::class);


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

        Product::factory()->count(100)->create();

        // ================ default seeder :: Enf =====================

    }
}
