<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmpresaProveedora extends Model
{
    use HasFactory;

    protected $table = 'empresa_proveedora';
    protected $primaryKey = 'idEmpresaP';

    protected $fillable = [
        'nombre',
        'telefono',
        'contacto',
        'direccion'
    ];

    public function compras()
    {
        return $this->hasMany(Compra::class, 'idEmpresaP');
    }

    public function getTotalComprasAttribute()
    {
        return $this->compras()->count();
    }

    public function getMontoTotalComprasAttribute()
    {
        return $this->compras()->sum('totalPago');
    }

    public function getUltimaCompraAttribute()
    {
        return $this->compras()->latest()->first();
    }

    public function getProductosCompradosAttribute()
    {
        return $this->compras()->with('detalleCompras.producto')->get()
            ->pluck('detalleCompras')->flatten()->pluck('producto')->unique('idProducto');
    }
}