<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Gerente extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'gerente';
    protected $primaryKey = 'idGerente';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'idGerente',
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
        'fecha_contratacion' => 'date'
    ];

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'idGerente', 'idPersona');
    }

    public function compras()
    {
        return $this->hasMany(Compra::class, 'idGerente');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'idUsuario', 'idGerente');
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

    public function getTotalComprasAttribute()
    {
        return $this->compras()->count();
    }

    public function getMontoTotalComprasAttribute()
    {
        return $this->compras()->sum('totalPago');
    }
}