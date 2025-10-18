<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;


    protected $fillable = ['ci', 'email', 'direccion', 'fecha_contratacion', 'role', 'password'];
    protected $hidden = ['password', 'remember_token'];
    protected $casts = ['fecha_contratacion' => 'datetime'];


    public function persona()
    {
        return $this->belongsTo(Persona::class, 'idUser', 'idPersona');
    }
}
