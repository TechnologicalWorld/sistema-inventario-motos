<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    protected $table = 'personas';
    protected $primaryKey = 'idPersona';
    public $incrementing = true;
    protected $keyType = 'int';


    protected $fillable = ['ci', 'paterno', 'materno', 'nombres', 'fechaNacimiento', 'genero', 'telefono'];


    public function gerente()
    {
        return $this->hasOne(Gerente::class, 'idGerente');
    }
    public function cliente()
    {
        return $this->hasOne(Cliente::class, 'idCliente');
    }
    public function empleado()
    {
        return $this->hasOne(Empleado::class, 'idEmpleado');
    }
    public function propietario()
    {
        return $this->hasOne(Propietario::class, 'idPropietario');
    }

    public function getRoleAttribute()
    {
        if ($this->gerente) return 'gerente';
        if ($this->empleado) return 'empleado';
        if ($this->propietario) return 'propietario';
        return null;
    }

    public function getAuthModel()
    {
        if ($this->gerente) return $this->gerente;
        if ($this->empleado) return $this->empleado;
        return null;
    }
}
