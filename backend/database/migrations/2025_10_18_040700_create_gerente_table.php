<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('gerente', function (Blueprint $table) {
            $table->id('idGerente');
            $table->date('fecha_contratacion');
            $table->string('email')->unique();
            $table->string('direccion');
            $table->string('password');
            $table->timestamps();

            $table->foreign('idGerente')->references('idPersona')->on('persona')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('gerente');
    }
};