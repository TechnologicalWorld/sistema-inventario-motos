<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('producto', function (Blueprint $table) {
            $table->id('idProducto');
            $table->string('nombre');
            $table->string('codigoProducto')->unique();
            $table->text('descripcion')->nullable();
            $table->decimal('precioVenta', 10, 2);
            $table->decimal('precioCompra', 10, 2);
            $table->integer('stock')->default(0);
            $table->integer('stockMinimo')->default(0);
            $table->enum('estado', ['activo', 'inactivo'])->default('activo');
            $table->foreignId('idCategoria')->constrained('categoria', 'idCategoria')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('producto');
    }
};