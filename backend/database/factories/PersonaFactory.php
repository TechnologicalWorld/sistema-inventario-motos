<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Persona;

class PersonaFactory extends Factory
{
    protected $model = Persona::class;

    public function definition(): array
    {
        return [
            'ci' => $this->faker->unique()->numerify('########'),
            'paterno' => $this->faker->lastName(),
            'materno' => $this->faker->lastName(),
            'nombres' => $this->faker->firstName(),
            'fecha_naci' => $this->faker->date(),
            'genero' => $this->faker->randomElement(['M','F','O']),
            'telefono' => $this->faker->phoneNumber(),
        ];
    }
}
