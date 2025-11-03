<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
    protected $table = 'personal_access_tokens';

    public function user()
    {
        return $this->belongsTo(User::class, 'tokenable_id', 'idUsuario');
    }
}