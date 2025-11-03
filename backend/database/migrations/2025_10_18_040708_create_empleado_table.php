<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('empleado', function (Blueprint $table) {
            $table->unsignedBigInteger("idEmpleado")->primary();
            $table->foreign('idEmpleado')->references('idPersona')->on('persona')->onDelete('cascade');
            $table->date('fecha_contratacion');
            $table->string('email');
            $table->string('direccion');
            $table->string('password');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('empleado');
    }
};