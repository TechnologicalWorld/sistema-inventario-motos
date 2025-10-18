<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
Route::post('/register', [AuthController::class, 'register']);

Route::middleware(['auth:sanctum', 'role:gerente'])->group(function () {
    Route::get('/gerente/dashboard', function () {
        return response()->json(['message' => 'Dashboard Gerente']);
    });
});

Route::middleware(['auth:sanctum', 'role:empleado'])->group(function () {
    Route::get('/empleado/dashboard', function () {
        return response()->json(['message' => 'Dashboard Empleado']);
    });
});

Route::middleware(['auth:sanctum', 'role:gerente,empleado'])->group(function () {
    Route::get('/shared/dashboard', function () {
        return response()->json(['message' => 'Dashboard Compartido']);
    });
});
