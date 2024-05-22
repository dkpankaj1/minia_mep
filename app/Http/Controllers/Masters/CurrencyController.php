<?php
namespace App\Http\Controllers\Masters;

use App\Models\Currency;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CurrencyController extends Controller
{
    use AuthorizationFilter;
    public function __construct()
    {
        $this->authorizeOrFail('currency.manage');
    }
    public function index(Request $request)
    {
        // Define the columns you need
        $columns = ['id', 'name', 'short_name', 'symbol']; // Add other necessary columns here

        // Fetch paginated currencys with only necessary columns
        $currencies = Currency::select($columns)->latest()->paginate(10); // Adjust pagination size as needed

        // Count the total number of currencys
        $currencyCount = Currency::count();

        // Generate breadcrumb
        $breadcrumb = Breadcrumbs::generate('currency.index');

        return Inertia::render('Masters/CurrencyMaster/Index', [
            'currencies' => $currencies,
            'currencyCount' => $currencyCount,
            'breadcrumb' => $breadcrumb
        ]);
    }

    public function show()
    {

    }

    public function create()
    {

    }

    public function store(Request $request)
    {
        // Use array validation for better performance
        $validated = $request->validate([
            'name' => 'required|string|unique:currencies,name',
            'short_name' => 'required|string',
            'symbol' => 'required|string',
        ]);

        try {
            // Use the validated data directly to create the currency
            Currency::create([
                'name' => $validated['name'],
                'short_name' => $validated['short_name'],
                'symbol' => $validated['symbol'],
            ]);

            return redirect()->route('currency.index')->with('success', 'Currency created');
        } catch (\Exception $e) {
            // Log the exception for debugging purposes
            \Log::error('Currency creation failed', ['error' => $e->getMessage()]);

            // Return a generic error message to avoid exposing sensitive information
            return redirect()->back()->with('danger', 'An error occurred while creating the currency.');
        }
    }

    public function edit()
    {

    }

    public function update(Request $request, Currency $currency)
    {
        // Validate the request data
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                Rule::unique('currencies', 'name')->ignore($currency->id)
            ],
            'short_name' => 'required|string',
            'symbol' => 'required|string',
        ]);

        try {
            // Update the brand using the validated data
            $currency->update([
                'name' => $validated['name'] ?? $request->name,
                'short_name' => $validated['short_name'] ?? $request->short_name,
                'symbol' => $validated['symbol'] ?? $request->symbol,

            ]);

            return redirect()->route('currency.index')->with('success', 'Currency updated');
        } catch (\Exception $e) {
            // Log the exception for debugging purposes
            \Log::error('Currency update failed', ['error' => $e->getMessage()]);

            // Return a generic error message to avoid exposing sensitive information
            return redirect()->back()->with('danger', 'An error occurred while updating the currency.');
        }
    }

    public function destroy(Currency $currency)
    {
        try {
            $currency->delete();
            return redirect()->route('currency.index')->with('success', 'Currency deleted');
        } catch (\Exception $e) {
            // Log the exception for debugging purposes
            \Log::error('Currency deletion failed', ['error' => $e->getMessage()]);

            // Return a generic error message to avoid exposing sensitive information
            return redirect()->back()->with('danger', 'An error occurred while deleting the currency.');
        }
    }
}
