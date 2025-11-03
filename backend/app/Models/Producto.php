<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $table = 'producto';
    protected $primaryKey = 'idProducto';

    protected $fillable = [
        'nombre',
        'codigoProducto',
        'descripcion',
        'precioVenta',
        'precioCompra',
        'stock',
        'stockMinimo',
        'estado',
        'idCategoria'
    ];

    protected $casts = [
        'precioVenta' => 'decimal:2',
        'precioCompra' => 'decimal:2'
    ];


    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'idCategoria');
    }

    public function movimientos()
    {
        return $this->hasMany(MovimientoInventario::class, 'idProducto');
    }

    public function detallesCompras()
    {
        return $this->hasMany(DetalleCompra::class, 'idProducto');
    }
    
    public function detalleVentas()
    {
        return $this->hasMany(DetalleVenta::class, 'idProducto', 'idProducto');
    }

    public function getStockBajoAttribute()
    {
        return $this->stock <= $this->stockMinimo;
    }

    public function getMargenGananciaAttribute()
    {
        if ($this->precioCompra > 0) {
            return (($this->precioVenta - $this->precioCompra) / $this->precioCompra) * 100;
        }
        return 0;
    }

    public function getTotalVendidoAttribute()
    {
        return $this->detalleVentas()->sum('cantidad');
    }

    public function getIngresoTotalAttribute()
    {
        return $this->detalleVentas()->sum('subTotal');
    }

    public function scopeActivos($query)
    {
        return $query->where('estado', 'activo');
    }

    public function scopeStockBajo($query)
    {
        return $query->whereRaw('stock <= stockMinimo');
    }

    public function scopePorCategoria($query, $categoriaId)
    {
        return $query->where('idCategoria', $categoriaId);
    }

    public function scopeMasVendidos($query, $limit = 10)
    {
        return $query->withSum('detalleVentas', 'cantidad')
                    ->orderBy('detalle_ventas_sum_cantidad', 'desc')
                    ->limit($limit);
    }
}