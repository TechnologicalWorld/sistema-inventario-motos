<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasFactory;

    protected $table = 'categoria';
    protected $primaryKey = 'idCategoria';

    protected $fillable = [
        'nombre',
        'descripcion'
    ];

    public function productos()
    {
        return $this->hasMany(Producto::class, 'idCategoria');
    }

    public function getCantidadProductosAttribute()
    {
        return $this->productos()->count();
    }

    public function getProductosActivosAttribute()
    {
        return $this->productos()->where('estado', 'activo')->get();
    }

    public function getStockTotalAttribute()
    {
        return $this->productos()->sum('stock');
    }
}