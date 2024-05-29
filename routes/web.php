<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\RegisterUserController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Masters\BrandController;
use App\Http\Controllers\Masters\CurrencyController;
use App\Http\Controllers\Masters\FinanceYearsController;
use App\Http\Controllers\Masters\UnitController;
use App\Http\Controllers\Masters\WarehouseController;
use App\Http\Controllers\People\CustomerGroupController;
use App\Http\Controllers\People\SupplierController;
use App\Http\Controllers\Profile\PasswordController;
use App\Http\Controllers\Profile\ProfileController;
use App\Http\Controllers\Settings\CompanyController;
use App\Http\Controllers\Settings\MySettingController;
use App\Http\Controllers\Settings\SystemSettingController;
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

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('brand', BrandController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('currency', CurrencyController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('customer-group', CustomerGroupController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('finance-year', FinanceYearsController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('my-setting', MySettingController::class)->only(['index', 'update']);
    Route::resource('role', RoleController::class);
    Route::resource('setting/company', CompanyController::class)->only(['index', 'update']);
    Route::resource('setting/system', SystemSettingController::class)->only(['index', 'update']);
    Route::resource('supplier', SupplierController::class);
    Route::resource('unit', UnitController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('user', UserController::class);
    Route::resource('warehouse', WarehouseController::class);

    Route::get('profile', [ProfileController::class, "edit"])->name('profile.edit');
    Route::patch('profile', [ProfileController::class, "update"])->name('profile.update');
    Route::get('change-password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('change-password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [LoginController::class, 'destroy'])->name('logout');

});