<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Empleado;

class EmpleadoFactory extends Factory
{
    protected $model = Empleado::class;

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
