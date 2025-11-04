<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    use HasFactory;

    protected $table = 'venta';
    protected $primaryKey = 'idVenta';

    protected $fillable = [
        'fecha',
        'montoTotal',
        'metodoPago',
        'descripcion',
        'idCliente',
        'idEmpleado'
    ];

    protected $casts = [
        'fecha' => 'datetime',
        'montoTotal' => 'decimal:2'
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'idCliente');
    }

    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'idEmpleado');
    }

    public function detalleVentas()
    {
        return $this->hasMany(DetalleVenta::class, 'idVenta');
    }

    public function getNombreClienteAttribute()
    {
        return $this->cliente ? $this->cliente->nombre_completo : 'Cliente no registrado';
    }

    public function getNombreEmpleadoAttribute()
    {
        return $this->empleado ? $this->empleado->nombre_completo : '';
    }

    public function getCantidadProductosAttribute()
    {
        return $this->detalleVentas->sum('cantidad');
    }

    public function getMetodoPagoTextoAttribute()
    {
        return ucfirst($this->metodoPago);
    }

    public function scopePorFecha($query, $fechaInicio, $fechaFin = null)
    {
        $query->whereDate('fecha', '>=', $fechaInicio);
        
        if ($fechaFin) {
            $query->whereDate('fecha', '<=', $fechaFin);
        }
        
        return $query;
    }

    public function scopePorEmpleado($query, $empleadoId)
    {
        return $query->where('idEmpleado', $empleadoId);
    }

    public function scopePorCliente($query, $clienteId)
    {
        return $query->where('idCliente', $clienteId);
    }

    public function scopePorMetodoPago($query, $metodoPago)
    {
        return $query->where('metodoPago', $metodoPago);
    }
}