<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $table = 'cliente';
    protected $primaryKey = 'idCliente';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'idCliente',
        'nit'
    ];

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'idCliente', 'idPersona');
    }

    public function ventas()
    {
        return $this->hasMany(Venta::class, 'idCliente');
    }

    public function getNombreCompletoAttribute()
    {
        return $this->persona ? $this->persona->nombre_completo : '';
    }

    public function getTelefonoAttribute()
    {
        return $this->persona ? $this->persona->telefono : '';
    }
    
    public function getCiAttribute()
    {
        return $this->persona ? $this->persona->ci : '';
    }

    public function getTotalComprasAttribute()
    {
        return $this->ventas()->count();
    }

    public function getMontoTotalComprasAttribute()
    {
        return $this->ventas()->sum('montoTotal');
    }

    public function getUltimaCompraAttribute()
    {
        return $this->ventas()->latest()->first();
    }
}