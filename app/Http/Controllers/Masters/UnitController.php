<?php

namespace App\Http\Controllers\Masters;


use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UnitController extends Controller
{
    use AuthorizationFilter;
    public function __construct()
    {
        $this->authorizeOrFail('unit.manage');
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        // Generate breadcrumb
        $breadcrumb = Breadcrumbs::generate('unit.index');

        return Inertia::render("Masters/UnitMaster/Index", [
            'units' => Unit::with('baseUnit')->latest()->paginate(),
            'unitCount' => Unit::count(),
            'breadcrumb' => $breadcrumb
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
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique(Unit::class, 'name')],
            'short_name' => ['required', 'string', 'max:50', Rule::unique(Unit::class, 'short_name')],
            'operator' => ['required', 'string', Rule::in(['*', '/'])],
            'operator_value' => ['required', 'numeric'],
            'base_unit' => ['nullable', Rule::exists('units', 'id')],
        ]);

        $data = [
            'name' => $validated['name'],
            'short_name' => $validated['short_name'],
            'operator' => $validated['operator'],
            'operator_value' => $validated['operator_value'],
            'base_unit' => $validated['base_unit'] ?? null,
        ];

        // // If base_unit is null or empty, set default values for operator and operator_value
        // if (empty($validated['base_unit'])) {
        //     $data['operator'] = '*';
        //     $data['operator_value'] = 1;
        //     $data['base_unit'] = null;
        // }

        try {
            Unit::create($data);
            return redirect()->route('unit.index')->with('success', 'Unit created successfully.');
        } catch (\Exception $e) {
            \Log::error('Unit creation failed', ['error' => $e->getMessage()]);
            return redirect()->back()->with('danger', 'An error occurred while creating the unit.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Unit $unit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Unit $unit)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Unit $unit)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique(Unit::class, 'name')->ignore($unit->id)],
            'short_name' => ['required', 'string', 'max:50', Rule::unique(Unit::class, 'short_name')->ignore($unit->id)],
            'operator' => ['required', 'string', Rule::in(['*', '/'])],
            'operator_value' => ['required', 'numeric'],
            'base_unit' => ['nullable', Rule::exists('units', 'id')],
        ]);

        try {
            $unit->update([
                'name' => $validated['name'] ?? $unit->name,
                'short_name' => $validated['short_name'] ?? $unit->short_name,
                'operator' => $validated['operator'] ?? $unit->operator,
                'operator_value' => $validated['operator_value'] ?? $unit->operator_value,
                'base_unit' => $validated['base_unit'] ?? null,
            ]);

            return redirect()->route('unit.index')->with('success', 'Unit updated');
        } catch (\Exception $e) {
            \Log::error('Unit update failed', ['error' => $e->getMessage()]);
            return redirect()->back()->with('danger', 'An error occurred while updating the unit.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Unit $unit)
    {
        try {
            $unit->delete();
            return redirect()->route('unit.index')->with('success', 'Unit deleted');
        } catch (\Exception $e) {
            \Log::error('Unit deletion failed', ['error' => $e->getMessage()]);
            return redirect()->back()->with('danger', 'An error occurred while deleting the unit.');
        }
    }
}
