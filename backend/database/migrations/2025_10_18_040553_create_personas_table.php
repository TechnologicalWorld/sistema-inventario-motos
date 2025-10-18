<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('personas', function (Blueprint $table) {
            $table->id("idPersona");
            $table->string("ci")->unique();
            $table->string("paterno");
            $table->string("materno")->nullable();
            $table->string("nombres");
            $table->date('fechaNacimiento')->nullable();
            $table->enum("genero",['M',"F",'O'])->nullable();
            $table->string("telefono")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personas');
    }
};
