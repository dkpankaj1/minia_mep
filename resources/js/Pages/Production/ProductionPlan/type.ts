
export interface BOMsType {
    id: number;
    code: string;
    product: string;
    total: number;
    overhead_cost: number;
    other_cost: number;
}
export interface WorkStationsType {
    id: number;
    name: string;
}
export interface WarehousesType {
    id: number;
    name: string;
}

export interface FormFieldType {
    date: string | "";
    code: string | "";
    bill_of_material: number | "";
    warehouse: number | "";
    work_station: number | "";
    quantity: number;
    cost: number;
    other_cost: number;
    start_at: string | "";
    end_at: string | "";
}

