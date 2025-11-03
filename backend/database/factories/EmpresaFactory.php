<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Empresa;

class EmpresaFactory extends Factory
{
    protected $model = Empresa::class;

    public function definition(): array
    {
        return [
            'codigo' => 'EMP001',
            'mision' => $this->faker->sentence(),
            'vision' => $this->faker->sentence(),
            'nombre' => $this->faker->company(),
            'logo' => 'logo.png',
            'telefono' => $this->faker->phoneNumber(),
        ];
    }
}
