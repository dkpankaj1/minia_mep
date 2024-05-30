<?php

namespace App\Exports;

use App\Models\Customer;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class CustomerExport implements FromCollection, WithMapping, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Customer::all();
    }

    public function map($customer): array
    {
        return [
            $customer->id,
            $customer->name,
            $customer->email,
            $customer->phone,
            $customer->whatsapp,
            $customer->address,
            $customer->city,
            $customer->state,
            $customer->country,
            $customer->postal_code,
            $customer->customerGroup->name,
            $customer->is_active ? "active" : "Inactive",

        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Email',
            'Phone',
            'Whatsapp',
            'Address',
            'City',
            'State',
            'Country',
            'PostalCode',
            'Group',
            'Status',
        ];
    }
}
