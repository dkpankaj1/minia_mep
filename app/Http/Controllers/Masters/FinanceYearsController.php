<?php
namespace App\Http\Controllers\Masters;

use App\Models\FinanceYears;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class FinanceYearsController extends Controller
{
    use AuthorizationFilter;
    /**
     * Display a listing of the resource.
     */
    public function __construct()
    {
        $this->authorizeOrFail('finance-years.manage');
    }
    public function index()
    {
        return Inertia::render('Masters/FinanceYears/Index', [
            "finance_years" => FinanceYears::latest()->get(),
            "finance_years_count" => FinanceYears::count(),
            'breadcrumb' => Breadcrumbs::generate('finance-year.index')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required'],
            'start_date' => ['required'],
            'end_date' => ['required'],
        ]);
        try {
            FinanceYears::create([
                'name' => $request->name,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ]);

            return redirect()->route('finance-year.index')->with('success', 'FinanceYear Created.');

        } catch (\Exception $e) {
            return back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(FinanceYears $finance_year)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FinanceYears $finance_year)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FinanceYears $finance_year)
    {
        $request->validate([
            'name' => ['required'],
            'start_date' => ['required'],
            'end_date' => ['required'],
        ]);
        try {
            $finance_year->update([
                'name' => $request->name,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ]);

            return redirect()->back()->with('success', 'FinanceYear Updated.');

        } catch (\Exception $e) {
            return back()->with('danger', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FinanceYears $finance_year)
    {
        try {
            $finance_year->delete();
            return redirect()->route('finance-year.index')->with('success', 'FinanceYear Deleted.');

        } catch (\Exception $e) {
            return back()->with('danger', $e->getMessage());
        }
    }
}
