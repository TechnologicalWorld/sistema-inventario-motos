<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Propietario extends Model
{
    use HasFactory;

    protected $table = 'propietario';
    protected $primaryKey = 'idPropietario';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'idPropietario',
        'email',
        'password'
    ];

    protected $hidden = [
        'password'
    ];

    protected $casts = [
        'password' => 'hashed'
    ];

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'idPropietario', 'idPersona');
    }

    public function getNombreCompletoAttribute()
    {
        return $this->persona ? $this->persona->nombre_completo : '';
    }

    public function getCiAttribute()
    {
        return $this->persona ? $this->persona->ci : '';
    }

    public function getTelefonoAttribute()
    {
        return $this->persona ? $this->persona->telefono : '';
    }
}