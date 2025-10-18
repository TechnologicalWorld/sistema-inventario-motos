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
        Schema::create('gerente', function (Blueprint $table) {
            $table->unsignedBigInteger("idGerente")->primary();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('direccion')->nullable();
            $table->date('fechaContratacion')->nullable();
            $table->foreign('idGerente')->references('idPersona')->on('personas')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gerente');
    }
};
