<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\DetalleCompra;

class DetalleCompraFactory extends Factory
{
    protected $model = DetalleCompra::class;

    public function definition(): array
    {
        return [
            'precioUnitario' => $this->faker->randomFloat(2,5,300),
            'subTotal' => $this->faker->randomFloat(2,10,3000),
            'cantidad' => $this->faker->numberBetween(1,20),
        ];
    }
}
