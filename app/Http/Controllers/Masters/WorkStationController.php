<?php

namespace App\Http\Controllers\Masters;
use App\Http\Controllers\Controller;

use App\Models\WorkStation;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class WorkStationController extends Controller
{
    use AuthorizationFilter;
    public function index(Request $request)
    {
        $this->authorizeOrFail('workstation.index');
        return Inertia::render('Masters/WorkStation/List', [
            "workstations" => WorkStation::latest()->paginate(10),
            "wrkStnCount" => WorkStation::count(),
            'breadcrumb' => Breadcrumbs::generate('workstation.index'),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeOrFail('workstation.index');
        $request->validate([
            'name' => ['required', Rule::unique(WorkStation::class, 'name')],
            'status' => ['required', 'numeric']
        ]);
        try {
            WorkStation::create([
                'name' => $request->name,
                'status' => $request->status,
                'description' => $request->description,
            ]);
            return redirect()->route('workstation.index')->with('success', 'Workstation created');
        } catch (\Exception $e) {
            return redirect()->route('workstation.index')->with('danger', $e->getMessage());
        }
    }

    public function update(Request $request, WorkStation $workstation)
    {
        $this->authorizeOrFail('workstation.index');
        $request->validate([
            'name' => ['required', Rule::unique(WorkStation::class, 'name')->ignore($workstation->id)],
            'status' => ['required', 'numeric']
        ]);
        try {
            $workstation->update([
                'name' => $request->name,
                'status' => $request->status,
                'description' => $request->description,
            ]);
            return redirect()->route('workstation.index')->with('success', 'Workstation updated');
        } catch (\Exception $e) {
            return redirect()->route('workstation.index')->with('danger', $e->getMessage());
        }

    }

    public function destroy(WorkStation $workstation)
    {
        $this->authorizeOrFail('workstation.index');
        try {
            $workstation->delete();
            return redirect()->route('workstation.index')->with('success', 'Workstation deleted');
        } catch (\Exception $e) {
            return redirect()->route('workstation.index')->with('danger', $e->getMessage());
        }
    }
}
