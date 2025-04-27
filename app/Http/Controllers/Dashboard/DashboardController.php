<?php

namespace App\Http\Controllers\Dashboard;

use App\Helpers\CustomHelpers;
use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\Supplier;
use App\Models\User;
use Diglactic\Breadcrumbs\Breadcrumbs;

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $totalCustomer = Customer::count();
        $totalSupplier = Supplier::count();
        $totalProduct = Product::count();

        $todaySale = Sale::whereDate('created_at', now())->where('order_status', 'received')->sum('grand_total');
        $todaySalePayment = Sale::whereDate('created_at', now())->where('order_status', 'received')->sum('grand_total');
        $todayPurchase = Purchase::whereDate('created_at', now())->where('order_status', 'received')->sum('grand_total');
        $todayPurchasePayment = Purchase::whereDate('created_at', now())->where('order_status', 'received')->sum('grand_total');

        return Inertia::render('Dashboard/Index', [
            'breadcrumb' => Breadcrumbs::generate('dashboard'),
            'logs' => CustomHelpers::getLogs(50),
            'totalUsers' => $totalUsers,
            'totalCustomer' => $totalCustomer,
            'totalSupplier' => $totalSupplier,
            'totalProduct' => $totalProduct,
            'todaySale' => $todaySale,
            'todaySalePayment' => $todaySalePayment,
            'todayPurchase' => $todayPurchase,
            'todayPurchasePayment' => $todayPurchasePayment,
        ]);
    }
}
