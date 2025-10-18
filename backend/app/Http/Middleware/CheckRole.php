<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        $userRole = $this->getUserRole($user);

        if (!in_array($userRole, $roles)) {
            return response()->json(['error' => 'No autorizado para esta acción'], 403);
        }

        return $next($request);
    }

    private function getUserRole($user)
    {
        if ($user instanceof \App\Models\Gerente) {
            return 'gerente';
        }

        if ($user instanceof \App\Models\Empleado) {
            return 'empleado';
        }

        return null;
    }
}