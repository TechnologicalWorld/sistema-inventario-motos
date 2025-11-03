<?php

namespace Database\Factories;

use App\Models\Persona;  
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'idUsuario' => Persona::factory(), 
            'email' => $this->faker->unique()->safeEmail(),
            'direccion' => $this->faker->address(),
            'fecha_contratacion' => $this->faker->date(),
            'tipo' => $this->faker->randomElement(['empleado', 'gerente', 'propietario']),
            'password' => Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
