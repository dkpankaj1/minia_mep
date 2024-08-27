<?php

namespace App\Http\Controllers\Payment;

use App\Enums\PaymentStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\Purchase\StorePurchasePaymentRequest;
use App\Http\Requests\Payment\Purchase\UpdatePurchasePaymentRequest;
use App\Http\Resources\Payment\PurchasePaymentResource;
use App\Models\PaymentPurchase;
use App\Models\Purchase;
use App\Models\Supplier;
use App\Traits\AuthorizationFilter;
use Carbon\Carbon;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchasePaymentController extends Controller
{
    use AuthorizationFilter;
    public function index(Request $request)
    {
        $this->authorizeOrFail('payment.purchase.index');
        $limit = $request->query('limit', 10);

        $purchasePaymentQuery = PaymentPurchase::query();

        $payments = $purchasePaymentQuery
            ->latest()
            ->paginate($limit)
            ->withQueryString();

        $formattedPurchasePayment = $payments->map(function ($payment) {
            return [
                'id' => $payment->id,
                'date' => $payment->date,
                'purchase_id' => $payment->purchase->id,
                'reference_no' => $payment->purchase->reference,
                'supplier' => $payment->purchase->supplier->name,
                'email' => $payment->purchase->supplier->email,
                'status' => $payment->pmt_status,
                'method' => $payment->pmt_mode,
                'amount' => $payment->amount,
                'user' => $payment->user->email,
            ];
        });

        return Inertia::render('Payment/Purchase/List', [
            'payments' => [
                'data' => $formattedPurchasePayment,
                'links' => $payments->linkCollection()->toArray(),
            ],
            'paymentCount' => PaymentPurchase::count(),
            'breadcrumb' => Breadcrumbs::generate('purchase.payment.index')
        ]);
    }

    public function create(Request $request)
    {
        $this->authorizeOrFail('payment.purchase.create');

        $selectedPurchase = [];

        if ($request->has('purchase')) {
            $purchase = Purchase::find($request->purchase);
            $selectedPurchase = $purchase ? (object) [
                'supplier_id' => $purchase->supplier_id,
                'purchase_id' => $purchase->id,
                'amount' => $purchase->grand_total - $purchase->paid_amount,
            ] : [];

            if ($purchase->payment_status === PaymentStatusEnum::PAID) {
                return redirect()->back()->with('danger', "!! Already paid. !!");
            }
        }

        $suppliers = Supplier::select(['id', 'name', 'email',])->with([
            'purchases' => function ($query) {
                $query->select(['id', 'reference', 'supplier_id', 'grand_total', 'paid_amount', 'payment_status'])
                    ->where('payment_status', '!=', PaymentStatusEnum::PAID);
            }
        ])->get();


        $supplierWithPurchase = $suppliers->map(function ($supplier) {
            return (object) [
                'id' => $supplier->id,
                'name' => $supplier->name,
                'email' => $supplier->email,
                'purchases' => $supplier->purchases->map(function ($purchase) {
                    return (object) [
                        'id' => $purchase->id,
                        'reference' => $purchase->reference,
                        'amount' => $purchase->grand_total - $purchase->paid_amount,
                    ];
                }),
            ];
        });

        return Inertia::render('Payment/Purchase/Create', [
            'selectedPurchase' => $selectedPurchase,
            'suppliers' => $supplierWithPurchase,
            'breadcrumb' => Breadcrumbs::generate('purchase.payment.create')
        ]);

    }
    public function store(StorePurchasePaymentRequest $request)
    {
        $this->authorizeOrFail('payment.purchase.create');
        try {


            $supplierPurchase = Purchase::where([
                'id' => $request->purchase_id,
                'supplier_id' => $request->supplier_id
            ])->first();

            if (!$supplierPurchase) {
                throw new \Exception("!! No purchase found !!");
            }
            if ($request->amount > $supplierPurchase->grand_total) {
                throw new \Exception("Paid amount cannot be greater than the total amount.");
            }


            DB::transaction(function () use ($request, $supplierPurchase) {

                PaymentPurchase::create([
                    "date" => $request->date,
                    "purchase_id" => $supplierPurchase->id,
                    "amount" => $request->amount,
                    "transaction_id" => $request->transaction_id,
                    "pmt_mode" => $request->payment_mode,
                    "pmt_status" => 'complete',
                    "note" => $request->note ?? 'no notes',
                    "user_id" => auth()->user()->id,
                ]);

                $supplierPurchase->update([
                    "paid_amount" => $supplierPurchase->paid_amount + $request->amount,
                    "payment_status" => $supplierPurchase->grand_total <= ($supplierPurchase->paid_amount + $request->amount)
                        ? PaymentStatusEnum::PAID
                        : PaymentStatusEnum::PARTIAL
                ]);

            }, 10);
            return redirect()->route('purchase.payment.index')->with('success', 'Payment successfully created.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }
    public function show(PaymentPurchase $payment)
    {
        $this->authorizeOrFail('payment.purchase.index');

        return Inertia::render('Payment/Purchase/Show', [
            'breadcrumb' => Breadcrumbs::generate('payment.purchase.show', $payment)
        ]);

    }
    public function Edit(PaymentPurchase $payment)
    {
        $this->authorizeOrFail('payment.purchase.edit');

        $dueAmount = $payment->purchase->grand_total - ($payment->purchase->paid_amount - $payment->amount);

        $formattedPayment = (object) [
            'id' => $payment->id,
            "date" => Carbon::parse($payment->date)->format('Y-m-d'),
            "supplier" => "{$payment->purchase->supplier->name} - {$payment->purchase->supplier->email}",
            "reference_no" => $payment->purchase->reference,
            "due_amount" => $dueAmount,
            "amount" => $payment->amount,
            "transaction_id" => $payment->transaction_id,
            "payment_method" => $payment->pmt_mode,
            "note" => $payment->note,
        ];

        return Inertia::render('Payment/Purchase/Edit', [
            'payment' => $formattedPayment,
            'breadcrumb' => Breadcrumbs::generate('purchase.payment.edit', $payment)
        ]);

    }
    public function update(UpdatePurchasePaymentRequest $request, PaymentPurchase $payment)
    {
        $this->authorizeOrFail('payment.purchase.edit');

        $dueAmount = $payment->purchase->grand_total - ($payment->purchase->paid_amount - $payment->amount);

        if ($request->amount > $dueAmount) {
            return redirect()->back()->with('danger', 'Paid amount cannot be greater than the total amount.');
        }

        try {
            DB::transaction(function () use ($request, $payment) {
                // Calculate the new paid amount
                $newPaidAmount = ($payment->purchase->paid_amount - $payment->amount) + $request->amount;

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
                $payment->purchase()->update([
                    'paid_amount' => $newPaidAmount,
                    'payment_status' => $payment->purchase->grand_total <= $newPaidAmount
                        ? PaymentStatusEnum::PAID
                        : PaymentStatusEnum::PARTIAL,
                ]);
            }, 10);

            return redirect()->route('purchase.payment.index')->with('success', 'Payment successfully updated.');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    public function destroy(PaymentPurchase $payment)
    {
        $this->authorizeOrFail('payment.purchase.delete');

        try {
            DB::transaction(function () use ($payment) {

                // Calculate the new paid amount
                $newPaidAmount = $payment->purchase->paid_amount - $payment->amount;

                // Update purchase details
                $payment->purchase()->update([
                    'paid_amount' => $newPaidAmount,
                    'payment_status' => $payment->purchase->grand_total <= $newPaidAmount
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
