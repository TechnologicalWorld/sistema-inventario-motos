<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MovimientoInventario extends Model
{
    use HasFactory;

    protected $table = 'movimiento_inventario';
    protected $primaryKey = 'idMovimiento';

    protected $fillable = [
        'tipo',
        'cantidad',
        'observacion',
        'fechaMovimiento',
        'idEmpleado',
        'idProducto'
    ];

    protected $casts = [
        'fechaMovimiento' => 'datetime',
        'cantidad' => 'integer'
    ];

    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'idEmpleado');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'idProducto');
    }

    public function getTipoTextoAttribute()
    {
        return $this->tipo === 'entrada' ? 'Entrada' : 'Salida';
    }

    public function getColorTipoAttribute()
    {
        return $this->tipo === 'entrada' ? 'success' : 'danger';
    }

    public function getNombreEmpleadoAttribute()
    {
        return $this->empleado ? $this->empleado->nombre_completo : '';
    }

    public function getNombreProductoAttribute()
    {
        return $this->producto ? $this->producto->nombre : '';
    }

    public function scopeEntradas($query)
    {
        return $query->where('tipo', 'entrada');
    }

    public function scopeSalidas($query)
    {
        return $query->where('tipo', 'salida');
    }

    public function scopePorFecha($query, $fechaInicio, $fechaFin = null)
    {
        $query->whereDate('fechaMovimiento', '>=', $fechaInicio);
        
        if ($fechaFin) {
            $query->whereDate('fechaMovimiento', '<=', $fechaFin);
        }
        
        return $query;
    }

    public function scopePorEmpleado($query, $empleadoId)
    {
        return $query->where('idEmpleado', $empleadoId);
    }

    public function scopePorProducto($query, $productoId)
    {
        return $query->where('idProducto', $productoId);
    }
}