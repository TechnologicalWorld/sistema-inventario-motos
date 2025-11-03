<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\MovimientoInventario;

class MovimientoInventarioFactory extends Factory
{
    protected $model = MovimientoInventario::class;

    public function definition(): array
    {
        return [
            'tipo' => $this->faker->randomElement(['entrada','salida']),
            'cantidad' => $this->faker->numberBetween(1, 50),
            'observacion' => $this->faker->sentence(),
            'fechaMovimiento' => $this->faker->dateTime(),
        ];
    }
}
