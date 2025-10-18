<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Gerente extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = "gerente";

    protected $primaryKey = 'idGerente';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'idGerente',
        'fechaContratacion',
        'email',
        'direccion',
        'password'
    ];

    protected $hidden = [
        'password'
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

    // Relación con Persona
    public function persona()
    {
        return $this->belongsTo(Persona::class,'idGerente', 'idPersona');
    }
}
