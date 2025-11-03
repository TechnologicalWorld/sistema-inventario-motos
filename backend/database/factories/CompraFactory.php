<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Compra;

class CompraFactory extends Factory
{
    protected $model = Compra::class;

    public function definition(): array
    {
        return [
            'fecha' => $this->faker->dateTime(),
            'totalPago' => $this->faker->randomFloat(2,50,5000),
            'observacion' => $this->faker->sentence(),
        ];
    }
}
