<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('venta', function (Blueprint $table) {
            $table->id('idVenta');
            $table->dateTime('fecha');
            $table->decimal('montoTotal', 10, 2);
            $table->enum('metodoPago', ['efectivo', 'tarjeta', 'transferencia']);
            $table->text('descripcion')->nullable();
            $table->foreignId('idCliente')->constrained('cliente', 'idCliente');
            $table->foreignId('idEmpleado')->constrained('empleado', 'idEmpleado');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('venta');
    }
};