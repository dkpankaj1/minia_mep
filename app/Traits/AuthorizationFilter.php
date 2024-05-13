<?php
namespace App\Traits;

use App\Exceptions\Unauthorize;
use Illuminate\Support\Facades\Gate;


trait AuthorizationFilter
{
    public function authorizeOrFail($ability, ...$args)
    {
        if(Gate::denies($ability, $args)){
            throw new Unauthorize();
        }
    }
}