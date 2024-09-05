<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\RegisterUserController;
use App\Http\Controllers\BillOfMaterialController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Customer\CustomerExportController;
use App\Http\Controllers\Customer\CustomerGroupController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Masters\BrandController;
use App\Http\Controllers\Masters\CurrencyController;
use App\Http\Controllers\Masters\FinanceYearsController;
use App\Http\Controllers\Masters\UnitController;
use App\Http\Controllers\Masters\WarehouseController;
use App\Http\Controllers\Payment\PurchasePaymentController;
use App\Http\Controllers\Payment\SalePaymentController;
use App\Http\Controllers\ProductCategories\CategoryController;
use App\Http\Controllers\ProductCategories\SubCategoryController;
use App\Http\Controllers\Products\ProductController;
use App\Http\Controllers\Products\ProductExportController;
use App\Http\Controllers\Profile\PasswordController;
use App\Http\Controllers\Profile\ProfileController;
use App\Http\Controllers\Purchase\PurchaseController;
use App\Http\Controllers\Purchase\PurchaseInvoicePrintController;
use App\Http\Controllers\Sale\SaleController;
use App\Http\Controllers\Sale\SaleInvoicePrintController;
use App\Http\Controllers\Settings\CompanyController;
use App\Http\Controllers\Settings\MySettingController;
use App\Http\Controllers\Settings\SystemSettingController;
use App\Http\Controllers\Supplier\SupplierController;
use App\Http\Controllers\Users\RoleController;
use App\Http\Controllers\Users\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});


Route::middleware('guest')->group(function () {

    Route::get('register', [RegisterUserController::class, 'create'])->name('register');
    Route::post('register', [RegisterUserController::class, 'store']);

    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'store']);

    Route::get('forgot-password', [ForgotPasswordController::class, 'create'])->name('password.request');
    Route::post('forgot-password', [ForgotPasswordController::class, 'store'])->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('reset-password', [NewPasswordController::class, 'store'])->name('password.store');

});

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('brand', BrandController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('currency', CurrencyController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::resource('category', CategoryController::class)->only(['index']);
    Route::resource('sub-category', SubCategoryController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::get('customer/export', CustomerExportController::class)->name('customer.export');
    Route::resource('customer', CustomerController::class);

    Route::resource('customer-group', CustomerGroupController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::resource('finance-year', FinanceYearsController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::resource('my-setting', MySettingController::class)->only(['index', 'update']);

    Route::get('product/export', ProductExportController::class)->name('product.export');

    Route::resource('product', ProductController::class);

    Route::prefix('production')->as('production.')->group(function () {
        Route::resource('bill-of-material', BillOfMaterialController::class);
    });

    Route::prefix('purchase')->as('purchase.')->group(function () {
        Route::resource('payment', PurchasePaymentController::class);
        Route::get('{purchase}/print', PurchaseInvoicePrintController::class)->name('print');
        Route::resource('/', PurchaseController::class, [
            'parameters' => [
                '' => 'purchase'
            ]
        ]);
    });

    Route::resource('role', RoleController::class);

    Route::prefix('sale')->as('sale.')->group(function () {
        Route::resource('payment', SalePaymentController::class);
        Route::get('{sale}/print', SaleInvoicePrintController::class)->name('print');
        Route::resource('/', SaleController::class, [
            'parameters' => [
                '' => 'sale'
            ]
        ]);
    });

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