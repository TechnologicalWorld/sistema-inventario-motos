<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleVenta extends Model
{
    use HasFactory;

    protected $table = 'detalle_venta';
    protected $primaryKey = 'idDetalleVenta';

    protected $fillable = [
        'cantidad',
        'precioUnitario',
        'subTotal',
        'descripcion',
        'idVenta',
        'idProducto'
    ];

    protected $casts = [
        'precioUnitario' => 'decimal:2',
        'subTotal' => 'decimal:2',
        'cantidad' => 'integer'
    ];

    public function venta()
    {
        return $this->belongsTo(Venta::class, 'idVenta');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'idProducto');
    }

    public function getNombreProductoAttribute()
    {
        return $this->producto ? $this->producto->nombre : 'Producto eliminado';
    }

    public function getCodigoProductoAttribute()
    {
        return $this->producto ? $this->producto->codigoProducto : '';
    }

    public function getPrecioCompraAttribute()
    {
        return $this->producto ? $this->producto->precioCompra : 0;
    }

    public function getGananciaAttribute()
    {
        return ($this->precioUnitario - $this->precio_compra) * $this->cantidad;
    }
}