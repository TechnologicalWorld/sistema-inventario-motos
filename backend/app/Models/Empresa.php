<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    use HasFactory;

    protected $table = 'empresa';
    protected $primaryKey = 'codigo';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'codigo',
        'mision',
        'vision',
        'nombre',
        'logo',
        'telefono'
    ];

    public function getSiglaAttribute()
    {
        return $this->logo;
    }

    public function getInformacionCompletaAttribute()
    {
        return [
            'nombre' => $this->nombre,
            'telefono' => $this->telefono,
            'mision' => $this->mision,
            'vision' => $this->vision,
            'sigla' => $this->sigla
        ];
    }

    public function getDatosContactoAttribute()
    {
        return [
            'telefono' => $this->telefono,
            'nombre' => $this->nombre
        ];
    }
}