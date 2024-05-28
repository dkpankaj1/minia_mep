<?php

namespace App\Http\Controllers\Settings;

use App\Enums\DefaultB65ImageEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\SystemSettingUpdateRequest;
use App\Models\SystemSetting;
use App\Traits\AuthorizationFilter;
use App\Traits\ImageManager;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SystemSettingController extends Controller
{
    use AuthorizationFilter,ImageManager;
    public function index()
    {
        $this->authorizeOrFail('company.index');

        $SystemSetting = SystemSetting::firstOrCreate(['id' => 1], [
            "app_name" => "Minia Admin",
            "logo" => DefaultB65ImageEnum::DEFAULT_LOGO,
            "favicon" => DefaultB65ImageEnum::DEFAULT_LOGO,
            'license' => "bWluaWFfYWRtaW5fbGljZW5jZQ=="

        ]);
        return Inertia::render('Settings/SystemSetting', [
            'systemSettingData' => $SystemSetting
        ]);
    }
    public function update(SystemSettingUpdateRequest $request, SystemSetting $system)
    {
        $this->authorizeOrFail('company.edit');

        try {
            $system->update([
                'app_name' => $request->app_name,
                'license' => $request->license
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
