<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleCompra extends Model
{
    use HasFactory;

    protected $table = 'detalle_compra';
    protected $primaryKey = 'idDetalleCompra';

    protected $fillable = [
        'precioUnitario',
        'subTotal',
        'cantidad',
        'idCompra',
        'idProducto'
    ];

    protected $casts = [
        'precioUnitario' => 'decimal:2',
        'subTotal' => 'decimal:2',
        'cantidad' => 'integer'
    ];

    public function compra()
    {
        return $this->belongsTo(Compra::class, 'idCompra');
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
}