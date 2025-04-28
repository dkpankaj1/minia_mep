<?php

namespace App\Http\Controllers\Expense;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    use AuthorizationFilter;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorizeOrFail('expense.index');



        $limit = 10;
        $expensesQuery = Expense::query();

        if ($request->limit) {
            $limit = $request->limit;
        }

        if ($request->search) {
            $searchTerm = '%' . $request->search . '%';
            $expensesQuery = $expensesQuery->where(function ($query) use ($searchTerm) {
                $query->where('title', 'like', $searchTerm)
                    ->orWhere('description', 'like', $searchTerm)
                    ->orWhere('expense_date', 'like', $searchTerm);
            });
        }

        $expenses = $expensesQuery->paginate(10)->withQueryString();

        $expenses->transform(function ($expense) {
            return [
                'id' => $expense->id,
                'title' => $expense->title,
                'amount' => $expense->amount,
                'date' => $expense->expense_date->format('d-m-Y'), // Format the date
                'created_at' => $expense->created_at->diffForHumans(),
                'updated_at' => $expense->updated_at->diffForHumans(),
            ];
        });

        return Inertia::render('Expense/Index', [
            'expenses' => $expenses,
            'expensesCount' => Expense::count(),
            'queryParam' => request()->query() ?: null,
            'breadcrumb' => Breadcrumbs::generate('expense.index'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorizeOrFail('expense.create');

        return Inertia::render('Expense/Create', [
            'breadcrumb' => Breadcrumbs::generate('expense.create'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorizeOrFail('expense.create');

        $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'expense_date' => 'required|date',
            'description' => 'required|string|max:255',
        ]);

        try {

            Expense::create([
                'title' => $request->input('title'),
                'amount' => $request->input('amount'),
                'expense_date' => $request->input('expense_date'),
                'description' => $request->input('description'),
                'user_id' => Auth::user()->id,
            ]);

            Log::info('Expense created successfully.');
            return redirect()->route('expense.index')->with('success', 'Expense created successfully.');

        } catch (Exception $e) {

            Log::error('Error creating expense: ' . $e->getMessage());
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Expense $expense)
    {
        $this->authorizeOrFail('expense.show');

        return Inertia::render(
            'Expense/Show',
            [
                'expense' => $expense,
                'breadcrumb' => Breadcrumbs::generate('expense.show', $expense)
            ]
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Expense $expense)
    {
        $this->authorizeOrFail('expense.edit');

        return Inertia::render('Expense/Edit', [
            'expense' => $expense,
            'breadcrumb' => Breadcrumbs::generate('expense.edit', $expense),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Expense $expense)
    {
        $this->authorizeOrFail('expense.edit');

        $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'expense_date' => 'required|date',
            'description' => 'required|string|max:255',
        ]);

        try {

            $expense->update([
                'title' => $request->input('title'),
                'amount' => $request->input('amount'),
                'expense_date' => $request->input('expense_date'),
                'description' => $request->input('description'),
                'user_id' => Auth::user()->id,
            ]);

            Log::info('Expense updated successfully.');
            return redirect()->route('expense.index')->with('success', 'Expense updated successfully.');

        } catch (Exception $e) {

            Log::error('Error updating expense: ' . $e->getMessage());
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        $this->authorizeOrFail('expense.delete');

        Log::info('Deleting expense', ['expense_id' => $expense->id]);

        try {
            $expense->delete();

            Log::info('expense deleted successfully.');

            return redirect()->back()->with('success', 'Expense deleted successfully.');

        } catch (Exception $e) {

            Log::error('Error deleting expense: ' . $e->getMessage());

            return redirect()->back()->with('danger', $e->getMessage());
        }
    }
}
