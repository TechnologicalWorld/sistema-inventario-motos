<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    use HasFactory;

    protected $table = 'persona';
    protected $primaryKey = 'idPersona';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'ci',
        'paterno', 
        'materno',
        'nombres',
        'fecha_naci',
        'genero',
        'telefono'
    ];

    protected $casts = [
        'fecha_naci' => 'date'
    ];

    // Relaciones
    public function gerente()
    {
        return $this->hasOne(Gerente::class, 'idGerente', 'idPersona');
    }

    public function cliente()
    {
        return $this->hasOne(Cliente::class, 'idCliente', 'idPersona');
    }

    public function empleado()
    {
        return $this->hasOne(Empleado::class, 'idEmpleado', 'idPersona');
    }

    public function propietario()
    {
        return $this->hasOne(Propietario::class, 'idPropietario', 'idPersona');
    }

    // Accessors
    public function getNombreCompletoAttribute()
    {
        return "{$this->nombres} {$this->paterno} {$this->materno}";
    }

    public function getEdadAttribute()
    {
        return $this->fecha_naci->age;
    }

    public function getRoleAttribute()
    {
        if ($this->gerente) return 'gerente';
        if ($this->empleado) return 'empleado';
        if ($this->propietario) return 'propietario';
        if ($this->cliente) return 'cliente';
        return null;
    }


    // Scopes
    public function scopeBuscar($query, $search)
    {
        return $query->where('nombres', 'like', "%{$search}%")
                    ->orWhere('paterno', 'like', "%{$search}%")
                    ->orWhere('materno', 'like', "%{$search}%")
                    ->orWhere('ci', 'like', "%{$search}%");
    }

    public function scopePorGenero($query, $genero)
    {
        return $query->where('genero', $genero);
    }
    public function scopeConRol($query, $rol)
    {
        switch ($rol) {
            case 'gerente':
                return $query->whereHas('gerente');
            case 'empleado':
                return $query->whereHas('empleado');
            case 'propietario':
                return $query->whereHas('propietario');
            case 'cliente':
                return $query->whereHas('cliente');
            default:
                return $query;
        }
    }
}