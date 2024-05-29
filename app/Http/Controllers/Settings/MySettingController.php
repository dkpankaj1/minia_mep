<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\MySettingUpdateRequest;
use App\Models\Currency;
use App\Models\FinanceYears;
use App\Models\MySetting;
use App\Traits\AuthorizationFilter;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MySettingController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Settings/MySetting', [
            'mySettingData' => MySetting::firstOrCreate(['user_id' => $request->user()->id], [
                'user_id' => $request->user()->id,
                'default_finance_year' => 1
            ]),
            'finance_years' => FinanceYears::all(),
            'breadcrumb' => Breadcrumbs::generate('my-setting.index')
        ]);
    }
    public function update(MySettingUpdateRequest $request, MySetting $my_setting)
    {
        try {
            $my_setting->update([
                'default_finance_year' => $request->default_finance_year,
            ]);

            return redirect()->route('my-setting.index')->with('success', 'Update successful');

        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }
}
