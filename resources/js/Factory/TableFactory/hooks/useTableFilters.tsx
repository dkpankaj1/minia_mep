import { useCallback, useState } from "react";
import { router } from "@inertiajs/react";
import { TQueryParam } from "@/types/queryParam.type";

type TUseTableFiltersReturn = {
    searchFieldChange: (name: string, value: string | number) => void;
    limitFieldChange: (name: string, value: string | number) => void;
    applyFilters: () => void;
    clearFilters: () => void;
    queryParam: TQueryParam;
};

const useTableFilters = (
    url: string,
    initialQueryParam: TQueryParam
): TUseTableFiltersReturn => {
    const [queryParam, setQueryParam] =
        useState<TQueryParam>(initialQueryParam);
    const updateQueryParam = useCallback(
        (name: string, value: string | number) => {
            setQueryParam((prevState) => {
                const updatedQueryParam = { ...prevState };
                if (value) {
                    updatedQueryParam[name] = value;
                } else {
                    delete updatedQueryParam[name];
                }
                return updatedQueryParam;
            });
        },
        []
    );

    const searchFieldChange = useCallback(
        (name: string, value: string | number) => {
            updateQueryParam(name, value);
        },
        [updateQueryParam]
    );

    const limitFieldChange = useCallback(
        (name: string, value: string | number) => {
            updateQueryParam(name, value);
            router.get(url, { ...queryParam, [name]: value });
        },
        [url, queryParam, updateQueryParam]
    );

    const applyFilters = useCallback(() => {
        router.get(url, queryParam);
    }, [url, queryParam]);

    const clearFilters = useCallback(() => {
        router.get(url, {});
    }, [url, queryParam]);

    return {
        searchFieldChange,
        applyFilters,
        limitFieldChange,
        clearFilters,
        queryParam,
    };
};

export default useTableFilters;
