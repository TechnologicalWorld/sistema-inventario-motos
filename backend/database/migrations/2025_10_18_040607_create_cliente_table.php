<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('cliente', function (Blueprint $table) {
            $table->id('idCliente');
            $table->string('nit')->nullable();
            $table->timestamps();

            $table->foreign('idCliente')->references('idPersona')->on('persona')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('cliente');
    }
};