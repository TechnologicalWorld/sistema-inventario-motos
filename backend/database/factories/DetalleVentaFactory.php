<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\DetalleVenta;

class DetalleVentaFactory extends Factory
{
    protected $model = DetalleVenta::class;

    public function definition(): array
    {
        return [
            'cantidad' => $this->faker->numberBetween(1,10),
            'precioUnitario' => $this->faker->randomFloat(2,10,500),
            'subTotal' => $this->faker->randomFloat(2,10,5000),
            'descripcion' => $this->faker->sentence(),
        ];
    }
}
