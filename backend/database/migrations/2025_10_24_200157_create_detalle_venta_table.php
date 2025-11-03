<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('detalle_venta', function (Blueprint $table) {
            $table->id('idDetalleVenta');
            $table->integer('cantidad');
            $table->decimal('precioUnitario', 10, 2);
            $table->decimal('subTotal', 10, 2);
            $table->text('descripcion')->nullable();
            $table->foreignId('idVenta')->constrained('venta', 'idVenta')->onDelete('cascade');
            $table->foreignId('idProducto')->constrained('producto', 'idProducto')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('detalle_venta');
    }
};