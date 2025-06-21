<?php

use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/debug-sentry', function () {
    throw new Exception('My first Sentry error!');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $todos = auth()->user()->todos()->latest()->get();
        return Inertia::render('dashboard', [
            'todos' => $todos,
        ]);
    })->name('dashboard');

    // Todo routes
    Route::post('/todos', [TodoController::class, 'store'])->name('todos.store');
    Route::patch('/todos/{todo}', [TodoController::class, 'update'])->name('todos.update');
    Route::delete('/todos/{todo}', [TodoController::class, 'destroy'])->name('todos.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
