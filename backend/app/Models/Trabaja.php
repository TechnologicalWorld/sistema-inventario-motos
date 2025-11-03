<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trabaja extends Model
{
    use HasFactory;

    protected $table = 'trabaja';
    protected $primaryKey = ['idEmpleado', 'idDepartamento'];
    public $incrementing = false;

    protected $fillable = [
        'idEmpleado',
        'idDepartamento',
        'fecha',
        'observacion'
    ];

    protected $casts = [
        'fecha' => 'date'
    ];

    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'idEmpleado');
    }

    public function departamento()
    {
        return $this->belongsTo(Departamento::class, 'idDepartamento');
    }

    public function getNombreEmpleadoAttribute()
    {
        return $this->empleado ? $this->empleado->nombre_completo : '';
    }

    public function getNombreDepartamentoAttribute()
    {
        return $this->departamento ? $this->departamento->nombre : '';
    }

    public function getCiEmpleadoAttribute()
    {
        return $this->empleado ? $this->empleado->ci : '';
    }
}