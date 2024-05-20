<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\RegisterUserController;
use App\Http\Controllers\FinanceYearsController;
use App\Http\Controllers\Profile\PasswordController;
use App\Http\Controllers\Profile\ProfileController;
use App\Http\Controllers\Users\RoleController;
use App\Http\Controllers\Users\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});


Route::middleware('guest')->group(function () {
    Route::get('register', [RegisterUserController::class, 'create'])
        ->name('register');
    Route::post('register', [RegisterUserController::class, 'store']);

    Route::get('login', [LoginController::class, 'create'])
        ->name('login');
    Route::post('login', [LoginController::class, 'store']);

    Route::get('forgot-password', [ForgotPasswordController::class, 'create'])
        ->name('password.request');
    Route::post('forgot-password', [ForgotPasswordController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');
    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware(['auth','verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('Dashboard/Index');
    })->name('dashboard');

    Route::resource('finance-year',FinanceYearsController::class);


    Route::resource('role',RoleController::class);
    Route::resource('user',UserController::class);

    Route::get('profile',[ProfileController::class,"edit"])->name('profile.edit');
    Route::patch('profile',[ProfileController::class,"update"])->name('profile.update');
    Route::get('change-password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('change-password', [PasswordController::class, 'update'])->name('password.update');
    
    Route::post('logout', [LoginController::class, 'destroy'])
    ->name('logout');

});