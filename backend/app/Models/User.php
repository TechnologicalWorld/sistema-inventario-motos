<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $primaryKey = 'idUsuario';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'idUsuario',
        'email', 
        'direccion',
        'fecha_contratacion',
        'tipo',
        'password'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'fecha_contratacion' => 'datetime'
    ];

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'idUsuario', 'idPersona');
    }
    

    public function getRoleAttribute()
    {
        return $this->tipo;
    }
    public function getSpecificModel()
    {
        if ($this->tipo === 'gerente') {
            return Gerente::find($this->idUsuario);
        } elseif ($this->tipo === 'empleado') {
            return Empleado::find($this->idUsuario);
        }
        return null;
    }
}