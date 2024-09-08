<?php
namespace App\Filters;
use Illuminate\Database\Eloquent\Builder;

class ProductionOrderFIlter
{

    public function filterByBom(Builder $query, $bom)
    {
        return $query->whereHas('billOfMaterial', function ($q) use ($bom) {
            $q->where('code', $bom);
        });
    }
    public function filterByDate(Builder $query, $date)
    {
        return $query->where('date', $date);
    }
    public function filterByProduct(Builder $query, $product)
    {
        return $query->whereHas('billOfMaterial', function ($q) use ($product) {
            $q->whereHas('product', function ($qq) use ($product) {
                $qq->where('id', $product);
            });
        });
    }
    public function filterByWorkStation(Builder $query, $workStation)
    {
        return $query->where('work_station_id', $workStation);
    }
    public function filterByStatus(Builder $query, $status)
    {
        return $query->where('status', $status);
    }
    public function filterByStartAT(Builder $query, $startDate)
    {
        return $query->where('start_at', $startDate);
    }
    public function filterByEndAT(Builder $query, $endDate)
    {
        return $query->where('end_at', $endDate);
    }

}
