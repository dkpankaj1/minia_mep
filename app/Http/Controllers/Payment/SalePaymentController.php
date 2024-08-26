<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Traits\AuthorizationFilter;
use Illuminate\Http\Request;

class SalePaymentController extends Controller
{
    use AuthorizationFilter;
    public function index(Request $request)
    {
        $this->authorizeOrFail('payment.sale.index');
    }
    public function create(Request $request)
    {
        $this->authorizeOrFail('payment.sale.create');
    }
    public function store(Request $request)
    {
        $this->authorizeOrFail('payment.sale.create');
    }
    public function show(Request $request)
    {
        $this->authorizeOrFail('payment.sale.index');
    }
    public function Edit(Request $request)
    {
        $this->authorizeOrFail('payment.sale.edit');
    }
    public function update(Request $request)
    {
        $this->authorizeOrFail('payment.sale.edit');
    }
    public function destroy(Request $request)
    {
        $this->authorizeOrFail('payment.sale.delete');
    }
}
