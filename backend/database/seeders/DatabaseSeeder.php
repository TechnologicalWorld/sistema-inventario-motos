<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create();

        //User::factory()->create(['name' => 'Test User', 'email' => 'test@example.com',]);
       
        /*
        $this->call([
            PersonaSeeder::class,
            PropietarioSeeder::class,
            GerenteSeeder::class,
            EmpleadoSeeder::class,
            ClienteSeeder::class,
            CategoriaSeeder::class,
            EmpresaProveedoraSeeder::class,
            ProductoSeeder::class,
            MovimientoInventarioSeeder::class,
            VentaSeeder::class,
            DetalleVentaSeeder::class,
            CompraSeeder::class,
            DetalleCompraSeeder::class,
            DepartamentoSeeder::class,
            EmpresaSeeder::class,
        ]);
        */
        $this->call([
            PersonaSeeder::class,
            CategoriaSeeder::class,
            DepartamentoSeeder::class,
            EmpresaSeeder::class,
            EmpresaProveedoraSeeder::class,
            ProductoSeeder::class,
            
            TrabajaSeeder::class,
        
            CompraSeeder::class,
            VentaSeeder::class,
            MovimientoInventarioSeeder::class,
            
            DetalleCompraSeeder::class,
            DetalleVentaSeeder::class,

        ]);
    }
}
