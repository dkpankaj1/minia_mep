export type TCurrencyType = {
    id: string | number;
    name: string;
    short_name: string;
    symbol: string
}
export type TCompanyType = {
    id : number;
    name : string;
    short_name : string;
    phone : string;
    email : string;
    address : string;
    city : string;
    state : string;
    country : string;
    postal_code : string;
    logo : string;
}
export type TSystemPagePropType = {
    id: string | number;
    app_name: string;
    logo: string;
    favicon: string;
    license: string;
    default_currency: string | number;
    currency: TCurrencyType
}