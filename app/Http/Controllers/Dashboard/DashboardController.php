<?php

namespace App\Http\Controllers\Dashboard;

use App\Helpers\CustomHelpers;
use App\Http\Controllers\Controller;
use Diglactic\Breadcrumbs\Breadcrumbs;

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
       
        return Inertia::render('Dashboard/Index', [
            'breadcrumb' => Breadcrumbs::generate('dashboard'),
            'logs' => CustomHelpers::getLogs(50)
        ]);
    }
}
