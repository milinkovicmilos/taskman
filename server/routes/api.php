<?php

use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;
use App\Http\Middleware\EnsureIsGuest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [RegisterController::class, 'register'])->middleware(EnsureIsGuest::class);
Route::post('/login', [LoginController::class, 'authenticate'])->middleware(EnsureIsGuest::class);
Route::post('/logout', [LoginController::class, 'logout']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
