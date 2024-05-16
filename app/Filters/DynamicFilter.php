<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class DynamicFilter {
    protected $request;
    protected $columns;
    protected $parameters;

    public function __construct(Request $request, array $columns, array $parameters)
    {
        $this->request = $request;
        $this->columns = $columns;
        $this->parameters = $parameters;
    }

    public function handle(Builder $builder, \Closure $next)
    {
        return $next($builder)->when(
            $this->anyParameterFilled(),
            function($query) {
                foreach ($this->columns as $index => $column) {
                    $parameter = $this->parameters[$index] ?? null;
                    if ($parameter && $this->request->filled($parameter)) {
                        $query->orWhere($column, 'REGEXP', $this->request->input($parameter));
                    }
                }
                return $query;
            }
        );
    }

    protected function anyParameterFilled()
    {
        foreach ($this->parameters as $parameter) {
            if ($this->request->filled($parameter)) {
                return true;
            }
        }
        return false;
    }
}
