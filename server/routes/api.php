<?php

use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskCompletionController;
use App\Http\Controllers\SubtaskController;
use App\Http\Controllers\SubtaskCompletionController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\MembershipController;
use App\Http\Middleware\EnsureIsGuest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [RegisterController::class, 'register'])->middleware(EnsureIsGuest::class);
Route::post('/login', [LoginController::class, 'authenticate'])->middleware(EnsureIsGuest::class);
Route::post('/logout', [LoginController::class, 'logout']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('projects', ProjectController::class)->middleware('auth:sanctum');

Route::apiResource('projects.tasks', TaskController::class)->middleware('auth:sanctum')->scoped();
Route::post('/projects/{project}/tasks/{task}/completed', [TaskCompletionController::class, 'store'])
    ->middleware('auth:sanctum')
    ->scopeBindings();
Route::delete('/projects/{project}/tasks/{task}/completed', [TaskCompletionController::class, 'destroy'])
    ->middleware('auth:sanctum')
    ->scopeBindings();

Route::apiResource('projects.tasks.subtasks', SubtaskController::class)->middleware('auth:sanctum')->scoped();
Route::post('/projects/{project}/tasks/{task}/subtasks/{subtask}/completed', [SubtaskCompletionController::class, 'store'])
    ->middleware('auth:sanctum')
    ->scopeBindings();
Route::delete('/projects/{project}/tasks/{task}/subtasks/{subtask}/completed', [SubtaskCompletionController::class, 'destroy'])
    ->middleware('auth:sanctum')
    ->scopeBindings();

Route::apiResource('groups', GroupController::class)->middleware('auth:sanctum');
Route::get('/groups/{group}/projects', [ProjectController::class, 'groupProjects'])
    ->middleware('auth:sanctum')
    ->scopeBindings();

Route::apiResource('groups.memberships', MembershipController::class)
    ->middleware('auth:sanctum')
    ->scoped();
