<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('compra', function (Blueprint $table) {
            $table->id('idCompra');
            $table->dateTime('fecha');
            $table->decimal('totalPago', 10, 2);
            $table->text('observacion')->nullable();
            $table->foreignId('idEmpresaP')->constrained('empresa_proveedora', 'idEmpresaP');
            $table->foreignId('idGerente')->constrained('gerente', 'idGerente');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('compra');
    }
};