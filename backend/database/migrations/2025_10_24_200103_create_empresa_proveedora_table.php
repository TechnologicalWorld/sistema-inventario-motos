<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('empresa_proveedora', function (Blueprint $table) {
            $table->id('idEmpresaP');
            $table->string('nombre');
            $table->string('telefono');
            $table->string('contacto');
            $table->text('direccion');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('empresa_proveedora');
    }
};