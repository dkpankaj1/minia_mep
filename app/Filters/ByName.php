<?php

namespace App\Filters;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ByName {
    protected $request;
    public function __construct(Request $request){
        $this->request = $request;
    }

    public function handle(Builder $builder, \Closure $next)
    {
        return $next($builder)->when(
            $this->request->filled('name'), fn($query) => $query->where('name', 'REGEXP', $this->request->name )
        );
    }
}
