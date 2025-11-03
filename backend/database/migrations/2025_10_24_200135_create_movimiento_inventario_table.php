<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('movimiento_inventario', function (Blueprint $table) {
            $table->id('idMovimiento');
            $table->enum('tipo', ['entrada', 'salida']);
            $table->integer('cantidad');
            $table->text('observacion')->nullable();
            $table->dateTime('fechaMovimiento');
            $table->foreignId('idEmpleado')->constrained('empleado', 'idEmpleado');
            $table->foreignId('idProducto')->constrained('producto', 'idProducto');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('movimiento_inventario');
    }
};