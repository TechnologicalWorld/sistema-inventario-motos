<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Categoria;

class ProductoFactory extends Factory
{
    public function definition()
    {
        return [
            'nombre' => $this->faker->word,
            'codigoProducto' => $this->faker->unique()->bothify('PROD-#####'),
            'descripcion' => $this->faker->sentence,
            'precioVenta' => $this->faker->randomFloat(2, 10, 1000),
            'precioCompra' => $this->faker->randomFloat(2, 5, 500),
            'stock' => $this->faker->numberBetween(0, 100),
            'stockMinimo' => $this->faker->numberBetween(5, 20),
            'estado' => $this->faker->randomElement(['activo', 'inactivo']),
            'idCategoria' => Categoria::inRandomOrder()->first()->idCategoria ?? Categoria::factory()->create()->idCategoria,
        ];
    }
}