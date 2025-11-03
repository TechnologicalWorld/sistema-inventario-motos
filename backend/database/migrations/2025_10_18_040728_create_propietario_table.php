<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('propietario', function (Blueprint $table) {
            $table->id('idPropietario');
            $table->string('email')->unique();
            $table->string('password');
            $table->timestamps();

            $table->foreign('idPropietario')->references('idPersona')->on('persona')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('propietario');
    }
};