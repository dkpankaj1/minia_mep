<?php

namespace App\Http\Controllers\Payment;

use App\Enums\PaymentStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\Sale\StoreSalePaymentRequest;
use App\Http\Requests\Payment\Sale\UpdateSalePaymentRequest;
use App\Models\Customer;
use App\Models\PaymentSale;
use App\Models\Sale;
use App\Traits\AuthorizationFilter;
use Carbon\Carbon;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SalePaymentController extends Controller
{
    use AuthorizationFilter;
    public function index(Request $request)
    {
        $this->authorizeOrFail('payment.sale.index');

        $limit = $request->query('limit', 10);

        $salePaymentQuery = PaymentSale::query();

        $payments = $salePaymentQuery
            ->latest()
            ->paginate($limit)
            ->withQueryString();

        $formattedSalePayment = $payments->map(function ($payment) {
            return [
                'id' => $payment->id,
                'date' => $payment->date,
                'sale_id' => $payment->sale->id,
                'invoice_id' => $payment->sale->invoice_id,
                'customer' => $payment->sale->customer->name,
                'email' => $payment->sale->customer->email,
                'status' => $payment->pmt_status,
                'method' => $payment->pmt_mode,
                'amount' => $payment->amount,
                'user' => $payment->user->email,
            ];
        });

        return Inertia::render('Payment/Sale/List', [
            'payments' => [
                'data' => $formattedSalePayment,
                'links' => $payments->linkCollection()->toArray(),
            ],
            'paymentCount' => PaymentSale::count(),
            'breadcrumb' => Breadcrumbs::generate('sale.payment.index')
        ]);

    }
    public function create(Request $request)
    {
        $this->authorizeOrFail('payment.sale.create');

        $selectedSale = [];

        if ($request->has('sale')) {
            $sale = Sale::find($request->sale);
            $selectedSale = $sale ? (object) [
                'id' => $sale->id,
                'customer_id' => $sale->customer_id,
                'amount' => $sale->grand_total - $sale->paid_amount,
            ] : [];

            if ($sale->payment_status === PaymentStatusEnum::PAID) {
                return redirect()->back()->with('danger', "!! Already paid. !!");
            }
        }

        $customers = Customer::select(['id', 'name', 'email',])->with([
            'sales' => function ($query) {
                $query->select(['id', 'invoice_id', 'customer_id', 'grand_total', 'paid_amount', 'payment_status'])
                    ->where('payment_status', '!=', PaymentStatusEnum::PAID);
            }
        ])->get();


        $customerWithSale = $customers->map(function ($customer) {
            return (object) [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'sales' => $customer->sales->map(function ($sale) {
                    return (object) [
                        'id' => $sale->id,
                        'invoice_id' => $sale->invoice_id,
                        'amount' => $sale->grand_total - $sale->paid_amount,
                    ];
                }),
            ];
        });

        return Inertia::render('Payment/Sale/Create', [
            'selectedSale' => $selectedSale,
            'customers' => $customerWithSale,
            'breadcrumb' => Breadcrumbs::generate('sale.payment.create')
        ]);
    }
    public function store(StoreSalePaymentRequest $request)
    {
        $this->authorizeOrFail('payment.sale.create');
        try {
            $customerSale = Sale::where([
                'id' => $request->sale,
                'customer_id' => $request->customer
            ])->first();
            if (!$customerSale) {
                throw new \Exception("!! No Invoice found !!");
            }
            if ($request->amount > $customerSale->grand_total) {
                throw new \Exception("Paid amount cannot be greater than the total amount.");
            }
            DB::transaction(function () use ($request, $customerSale) {
                PaymentSale::create([
                    "date" => $request->date,
                    "sale_id" => $customerSale->id,
                    "amount" => $request->amount,
                    "transaction_id" => $request->transaction_id,
                    "pmt_mode" => $request->payment_mode,
                    "pmt_status" => 'complete',
                    "note" => $request->note ?? 'no notes',
                    "user_id" => auth()->user()->id,
                ]);
                $customerSale->update([
                    "paid_amount" => $customerSale->paid_amount + $request->amount,
                    "payment_status" => $customerSale->grand_total <= ($customerSale->paid_amount + $request->amount)
                        ? PaymentStatusEnum::PAID
                        : PaymentStatusEnum::PARTIAL
                ]);
            }, 10);
            return redirect()->route('sale.payment.index')->with('success', 'Payment successfully created.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    public function show(Request $request)
    {
        $this->authorizeOrFail('payment.sale.index');
    }
    public function Edit(PaymentSale $payment)
    {
        $this->authorizeOrFail('sale.payment.edit');

        $dueAmount = $payment->sale->grand_total - ($payment->sale->paid_amount - $payment->amount);

        $formattedSale = (object) [
            'id' => $payment->id,
            "date" => Carbon::parse($payment->date)->format('Y-m-d'),
            "customer" => "{$payment->sale->customer->name} - {$payment->sale->customer->email}",
            "invoice_id" => $payment->sale->invoice_id,
            "due_amount" => $dueAmount,
            "amount" => $payment->amount,
            "transaction_id" => $payment->transaction_id,
            "payment_method" => $payment->pmt_mode,
            "note" => $payment->note,
        ];

        return Inertia::render('Payment/Sale/Edit', [
            'payment' => $formattedSale,
            'breadcrumb' => Breadcrumbs::generate('sale.payment.edit', $payment)
        ]);

    }
    public function update(UpdateSalePaymentRequest $request, PaymentSale $payment)
    {
        $this->authorizeOrFail('sale.purchase.edit');
        $dueAmount = $payment->sale->grand_total - ($payment->sale->paid_amount - $payment->amount);
        if ($request->amount > $dueAmount) {
            return redirect()->back()->with('danger', 'Paid amount cannot be greater than the total amount.');
        }
        try {
            DB::transaction(function () use ($request, $payment) {
                // Calculate the new paid amount
                $newPaidAmount = ($payment->sale->paid_amount - $payment->amount) + $request->amount;
                // Update payment details
                $payment->update([
                    'date' => $request->date,
                    'amount' => $request->amount,
                    'transaction_id' => $request->transaction_id,
                    'pmt_mode' => $request->payment_mode,
                    'pmt_status' => 'complete',
                    'note' => $request->note ?? 'no notes',
                    'user_id' => auth()->id(),
                ]);
                // Update purchase details
                $payment->sale()->update([
                    'paid_amount' => $newPaidAmount,
                    'payment_status' => $payment->sale->grand_total <= $newPaidAmount
                        ? PaymentStatusEnum::PAID
                        : PaymentStatusEnum::PARTIAL,
                ]);
            }, 10);
            return redirect()->route('sale.payment.index')->with('success', 'Payment successfully updated.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }
    public function destroy(PaymentSale $payment)
    {
        $this->authorizeOrFail('sale.purchase.delete');

        try {
            DB::transaction(function () use ($payment) {

                // Calculate the new paid amount
                $newPaidAmount = $payment->sale->paid_amount - $payment->amount;

                // Update purchase details
                $payment->sale()->update([
                    'paid_amount' => $newPaidAmount,
                    'payment_status' => $payment->sale->grand_total <= $newPaidAmount
                        ? PaymentStatusEnum::PAID
                        : PaymentStatusEnum::PARTIAL,
                ]);

                // Delete payment details
                $payment->delete();

            }, 10);

            return redirect()->back()->with('success', 'Payment successfully deleted.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }
}
