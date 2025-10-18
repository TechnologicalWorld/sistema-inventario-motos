<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Propietario extends Model
{
    use HasFactory;
    protected $table = "propietario";
    protected $primaryKey = 'idPropietario';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = ['idPropietario'];

    // Relación con Persona
    public function persona()
    {
        return $this->belongsTo(Persona::class,'idPropietario', 'idPersona');
    }
}
