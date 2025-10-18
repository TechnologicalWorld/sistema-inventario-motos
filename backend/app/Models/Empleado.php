<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Empleado extends Model
{
    use HasFactory, HasApiTokens;
    protected $table = "empleado";
    protected $primaryKey = 'idEmpleado';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'idEmpleado',
        'ci',
        'fecha_contratacion',
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
        return $this->belongsTo(Persona::class, 'idEmpleado', 'idPersona');
    }
}
