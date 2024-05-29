<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\SystemSettingUpdateRequest;
use App\Models\Currency;
use App\Models\FinanceYears;
use App\Models\SystemSetting;
use App\Traits\AuthorizationFilter;
use App\Traits\ImageManager;
use Diglactic\Breadcrumbs\Breadcrumbs;
use Inertia\Inertia;

class SystemSettingController extends Controller
{
    use AuthorizationFilter, ImageManager;
    public function index()
    {
        $this->authorizeOrFail('company.index');

        return Inertia::render('Settings/SystemSetting', [
            'systemSettingData' => SystemSetting::first(),
            'currencies' => Currency::all(),
            'breadcrumb' => Breadcrumbs::generate('system.index')
        ]);
    }
    public function update(SystemSettingUpdateRequest $request, SystemSetting $system)
    {
        $this->authorizeOrFail('company.edit');

        try {
            $system->update([
                'app_name' => $request->app_name,
                'license' => $request->license,
                'default_currency' => $request->default_currency,
            ]);

            if ($request->hasFile('logo')) {
                $system->update([
                    'logo' => $this->base64FromRequest($request->file('logo')->getRealPath(), null, 200)
                ]);
            }

            if ($request->hasFile('favicon')) {
                $system->update([
                    'favicon' => $this->base64FromRequest($request->file('favicon')->getRealPath(), null, 32)
                ]);
            }

            return redirect()->route('system.index')->with('success', 'Update successful');

        } catch (\Exception $e) {
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

}
