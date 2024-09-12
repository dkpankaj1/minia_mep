import { PageProp } from "@/types/global";
import { TSystemPagePropType } from "@/types/type";

export interface UnitType {
    id: number;
    name: string;
    short_name: string;
    operator: string;
    operator_value: number;
}

export interface MaterialType {
    productWarehouse_id: number;
    product: { id: number; name: string; code: string; is_batch: boolean };
    reqQuantity: number;
    avlQuantity: number;
    unit: UnitType;
    totalUnitCost: number;
    productBatches: { id: number; batch: string; quantity: number }[];
}

export interface ProductionOrderType {
    id: number;
    date: string;
    code: string;
    product: string;
    bom: {
        id: number;
        code: string;
        overhead_cost: number;
        other_cost: number;
    };
    quantity: number;
    unit: UnitType;
    materials: MaterialType[];
}

export interface ItemsType {
    productWarehouse_id: number;
    product: string;
    unit: UnitType;
    reqQuantity: number;
    avlQuantity: number;
    totalUnitCost: number;
    batch: number | null | undefined;
    is_batch : boolean;
    productBatches:
        | { id: number; batch: string; quantity: number }[]
        | null
        | undefined;
}

export interface FormFieldType {
    date: string | "";
    code:string;
    production_order: number | "";
    status: string;
    items: ItemsType[];
}

export interface PropsType {
    productionOrders: ProductionOrderType[];
    stockIssueCode:string;
    currentData: string;
}

export interface SystemPropsType extends PageProp {
    system: TSystemPagePropType;
}
