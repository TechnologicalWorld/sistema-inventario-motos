<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Compra extends Model
{
    use HasFactory;

    protected $table = 'compra';
    protected $primaryKey = 'idCompra';

    protected $fillable = [
        'fecha',
        'totalPago',
        'observacion',
        'idEmpresaP',
        'idGerente'
    ];

    protected $casts = [
        'fecha' => 'datetime',
        'totalPago' => 'decimal:2'
    ];

    public function empresaProveedora()
    {
        return $this->belongsTo(EmpresaProveedora::class, 'idEmpresaP');
    }

    public function gerente()
    {
        return $this->belongsTo(Gerente::class, 'idGerente');
    }

    public function detalleCompras()
    {
        return $this->hasMany(DetalleCompra::class, 'idCompra');
    }

    public function getNombreProveedorAttribute()
    {
        return $this->empresaProveedora ? $this->empresaProveedora->nombre : 'Proveedor no registrado';
    }

    public function getNombreGerenteAttribute()
    {
        return $this->gerente ? $this->gerente->nombre_completo : '';
    }

    public function getCantidadProductosAttribute()
    {
        return $this->detalleCompras->sum('cantidad');
    }

    public function scopePorFecha($query, $fechaInicio, $fechaFin = null)
    {
        $query->whereDate('fecha', '>=', $fechaInicio);
        
        if ($fechaFin) {
            $query->whereDate('fecha', '<=', $fechaFin);
        }
        
        return $query;
    }

    public function scopePorProveedor($query, $proveedorId)
    {
        return $query->where('idEmpresaP', $proveedorId);
    }

    public function scopePorGerente($query, $gerenteId)
    {
        return $query->where('idGerente', $gerenteId);
    }
}