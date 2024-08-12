type TCurrencyType = {
    id: string | number;
    name: string;
    short_name: string;
    symbol: string
}
type TSystemPagePropType = {
    id: string | number;
    app_name: string;
    logo: string;
    favicon: string;
    license: string;
    default_currency: string | number;
    currency: TCurrencyType
}