
export interface FormFieldType {
    code: string;
    date: string;
    production_order: string;
    is_batch: number;
    batch: string;
    expiration: string;
    status: string;
    remark: string;
}
export interface ProductionOrderType {
    id: string;
    code: string;
    product: {
        id: number;
        name: string;
        is_batch: number;
    };
}
export interface StockReceiveType{
    id: number;
    code: string;
    date: string;
    production_order: string;
    is_batch: number;
    batch_id: number;
    batch: string;
    expiration: string;
    status: string;
    remark: string;
}