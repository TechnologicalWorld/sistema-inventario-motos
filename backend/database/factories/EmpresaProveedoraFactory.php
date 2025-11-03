<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\EmpresaProveedora;

class EmpresaProveedoraFactory extends Factory
{
    protected $model = EmpresaProveedora::class;

    public function definition(): array
    {
        return [
            'nombre' => $this->faker->company(),
            'telefono' => $this->faker->phoneNumber(),
            'contacto' => $this->faker->name(),
            'direccion' => $this->faker->address(),
        ];
    }
}
