<?php

use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\PodController;
use App\Livewire\DashboardPage;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard')->name('home');

Route::middleware('auth')->group(function (): void {
    Route::get('dashboard', DashboardPage::class)
        ->name('dashboard');
});

Route::prefix('api')->group(function (): void {
    Route::get('pods', [PodController::class, 'index'])->name('api.pods.index');
    Route::post('pods', [PodController::class, 'store'])->name('api.pods.store');
    Route::get('events', [EventController::class, 'index'])->name('api.events.index');
});
