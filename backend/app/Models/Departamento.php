<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Departamento extends Model
{
    use HasFactory;

    protected $table = 'departamento';
    protected $primaryKey = 'idDepartamento';

    protected $fillable = [
        'nombre',
        'descripcion'
    ];

    public function empleados()
    {
        return $this->belongsToMany(Empleado::class, 'trabaja', 'idDepartamento', 'idEmpleado')
                    ->withPivot('fecha', 'observacion')
                    ->withTimestamps();
    }

    public function trabajos()
    {
        return $this->hasMany(Trabaja::class, 'idDepartamento');
    }

    public function getCantidadEmpleadosAttribute()
    {
        return $this->empleados()->count();
    }

    public function getEmpleadosActivosAttribute()
    {
        return $this->empleados()->whereHas('persona')->get();
    }

    public function scopeConEmpleados($query)
    {
        return $query->whereHas('empleados');
    }
}