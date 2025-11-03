<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('detalle_compra', function (Blueprint $table) {
            $table->id('idDetalleCompra');
            $table->decimal('precioUnitario', 10, 2);
            $table->decimal('subTotal', 10, 2);
            $table->integer('cantidad');
            $table->foreignId('idCompra')->constrained('compra', 'idCompra')->onDelete('cascade');
            $table->foreignId('idProducto')->constrained('producto', 'idProducto')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('detalle_compra');
    }
};