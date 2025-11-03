<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->unsignedBigInteger('idUsuario')->primary();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('direccion')->nullable();
            $table->date('fecha_contratacion')->nullable();
            $table->enum('tipo', ['gerente', 'empleado', 'propietario'])->default('empleado');
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();

            $table->foreign('idUsuario')->references('idPersona')->on('persona')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};