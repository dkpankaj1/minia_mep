export type TColumnType<T> = {
    header: string;
    accessor?: keyof T | null;
    render?: (row: T) => React.ReactNode;
}