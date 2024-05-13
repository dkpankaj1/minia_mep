<?php

namespace App\Exceptions;

use Exception;
use Inertia\Inertia;

class Unauthorize extends Exception
{
    public function render()
    {
        return Inertia::render('Errors/Error403');
    }
}
