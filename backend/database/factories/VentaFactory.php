<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Venta;

class VentaFactory extends Factory
{
    protected $model = Venta::class;

    public function definition(): array
    {
        return [
            'fecha' => $this->faker->dateTime(),
            'montoTotal' => $this->faker->randomFloat(2, 20, 1000),
            'metodoPago' => $this->faker->randomElement(['QR','efectivo','tarjeta','transferencia']),
        ];
    }
}
