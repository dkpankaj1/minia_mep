<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition()
    {
        $cost = $this->faker->randomFloat(2, 1, 100);
        return [
            'code' => $this->faker->unique()->numerify('PROD###'),
            'barcode_symbology' => $this->faker->randomElement([
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
            'name' => $this->faker->word,
            'unit_id' => 3,
            'purchase_unit_id' => 3,
            'sale_unit_id' => 3,
            'cost' => $cost,
            'price' => $cost + ($cost* 0.15),
            'tax_method' => $this->faker->randomElement(['exclusive', 'inclusive']),
            'net_tax' => $this->faker->randomFloat(2, 0, 20),
            'is_batch' => $this->faker->boolean,
            'stock_alert' => $this->faker->randomNumber(3),
            'is_active' => $this->faker->boolean,
            'description' => $this->faker->paragraph,
        ];
    }
}
