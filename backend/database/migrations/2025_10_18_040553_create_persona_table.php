<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('persona', function (Blueprint $table) {
            $table->id('idPersona');
            $table->string('ci', 20)->unique();
            $table->string('paterno', 50);
            $table->string('materno', 50);
            $table->string('nombres', 100);
            $table->date('fecha_naci');
            $table->enum('genero', ['M', 'F', 'O']);
            $table->string('telefono', 25);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('persona');
    }
};