<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Gerente;

class GerenteFactory extends Factory
{
    protected $model = Gerente::class;

    public function definition(): array
    {
        return [
            'email' => $this->faker->unique()->safeEmail(),
            'direccion' => $this->faker->address(),
            'fecha_contratacion' => $this->faker->date(),
            'password' => bcrypt('123456'),
        ];
    }
}
