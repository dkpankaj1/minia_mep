<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'email' => $this->faker->safeEmail,
            'phone' => $this->faker->phoneNumber,
            'whatsapp' => $this->faker->phoneNumber(),
            'address' => "no address",
            'city' => "no city",
            'state' => "no state",
            'country' => "india",
            'postal_code' => "123456",
            'customer_group_id' => $this->faker->randomElement([1,2]),
            'is_active' => true,
        ];
    }
}
