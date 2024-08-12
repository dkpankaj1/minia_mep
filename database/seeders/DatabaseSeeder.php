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


        Customer::factory()->count(100)->create();


        $productNames = collect([['name' => "Rice"], ['name' => "Sugar"], ['name' => "Printer Paper"], ['name' => "Monitor"], ['name' => "Mother Board"]]);

        $productNames->map(function ($product) {

            $cost = fake()->randomFloat(2, 1, 100);
            
            $product = (object) $product;

            Product::create(
                [
                    'code' => fake()->unique()->numerify('PROD###'),
                    'barcode_symbology' => fake()->randomElement([
                        'C128',
                        'C39',
                        'EAN13',
                        'UPCA',
                        'C93',
                        'EAN8',
                        'QRCODE',
                        'PDF417',
                        'DATAMATRIX',
                    ]),
                    'category_id' => 1,
                    'sub_category_id' => 1,
                    'brand_id' => 1,
                    'name' => $product->name,
                    'unit_id' => 3,
                    'purchase_unit_id' => 3,
                    'sale_unit_id' => 3,
                    'cost' => $cost,
                    'price' => $cost + ($cost * 0.15),
                    'tax_method' => fake()->randomElement([0, 1]),
                    'net_tax' => fake()->randomFloat(2, 0, 20),
                    'is_batch' => fake()->boolean,
                    'stock_alert' => fake()->randomNumber(2),
                    'is_active' => fake()->boolean,
                    'description' => fake()->paragraph,
                ]
            );
        });

        // ================ default seeder :: Enf =====================

    }
}
