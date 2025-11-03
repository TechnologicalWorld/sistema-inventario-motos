<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('trabaja', function (Blueprint $table) {
            $table->foreignId('idEmpleado')->constrained('empleado', 'idEmpleado');
            $table->foreignId('idDepartamento')->constrained('departamento', 'idDepartamento');
            $table->date('fecha');
            $table->text('observacion')->nullable();
            $table->timestamps();

            $table->primary(['idEmpleado', 'idDepartamento']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('trabaja');
    }
};