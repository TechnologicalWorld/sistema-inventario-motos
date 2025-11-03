<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Empleado extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'empleado';
    protected $primaryKey = 'idEmpleado';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'idEmpleado',
        'fecha_contratacion',
        'email',
        'direccion',
        'password'
    ];

    protected $hidden = [
        'password'
    ];

    protected $casts = [
        'password' => 'hashed',
        'fecha_contratacion' => 'date'
    ];

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'idEmpleado', 'idPersona');
    }

    public function ventas()
    {
        return $this->hasMany(Venta::class, 'idEmpleado');
    }

    public function movimientos()
    {
        return $this->hasMany(MovimientoInventario::class, 'idEmpleado');
    }

    public function departamentos()
    {
        return $this->belongsToMany(Departamento::class, 'trabaja', 'idEmpleado', 'idDepartamento')
                    ->withPivot('fecha', 'observacion')
                    ->withTimestamps();
    }

    public function trabajos()
    {
        return $this->hasMany(Trabaja::class, 'idEmpleado');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'idUsuario', 'idEmpleado');
    }

    public function getNombreCompletoAttribute()
    {
        return $this->persona ? $this->persona->nombre_completo : '';
    }

    public function getCiAttribute()
    {
        return $this->persona ? $this->persona->ci : '';
    }

    public function getTelefonoAttribute()
    {
        return $this->persona ? $this->persona->telefono : '';
    }

    // Métodos de negocio
    public function getTotalVentasAttribute()
    {
        return $this->ventas()->count();
    }

    public function getMontoTotalVentasAttribute()
    {
        return $this->ventas()->sum('montoTotal');
    }

    public function getTotalMovimientosAttribute()
    {
        return $this->movimientos()->count();
    }
}