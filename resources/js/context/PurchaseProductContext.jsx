import { useForm } from '@inertiajs/react';
import React, { createContext, useState, useEffect } from 'react'

const PurchaseContext = createContext();

const PurchaseProductProvider = ({ children, products, suppliers, warehouses }) => {

    const [searchQuery, setSearchQuery] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const { data, setData, post, processing, errors } = useForm({
        date: "",
        reference: "",
        supplier: "",
        warehouse: "",
        purchase_item: [],
        shipping_cost: 0,
        other_cost: 0,
        discount_type: "",
        discount: 0,
        note: ""
    })

    useEffect(() => {
        if (searchQuery === "") {
            setSearchResult([]);
        } else {
            const timeOutId = setTimeout(() => {
                const filteredProduct = products.data.filter((product) => {
                    return (
                        product.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                        product.code
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                    );
                });
                setSearchResult(filteredProduct);
            }, 500);
            return () => clearTimeout(timeOutId);
        }
    }, [searchQuery]);

    const handleAddToCart = (product) => {

        const newItem = {
            product_id: product.id,
            code: product.code,
            name: product.name,
            purchase_unit_id: product.unit,
            net_unit_cost: product.cost,
            quantity: 1,
            discount_method: "",
            discount: 0,
            tax_method: product.tax_method,
            tax_rate: product.net_tax,
            is_batch: product.is_batch,
            batch: "",
            expiration: ""
        };

        if (!data.purchase_item.some((cartItem) => cartItem.product_id === product.id)) {
            setData("purchase_item", [...data.purchase_item, newItem]);
        }

        setSearchQuery("");
    };

    const handleUpdateCartItem = (index, field, value) => {
        const updatedCartItems = [...data.purchase_item];
        updatedCartItems[index][field] = value;
        setData("purchase_item", updatedCartItems);
    }

    const handleRemoveFromCart = (index) => {
        const updatedCartItems = [...data.purchase_item];
        updatedCartItems.splice(index, 1);
        setData("purchase_item", updatedCartItems);
    }

    const getProductById = (id) => {
        const foundProduct = products.data.find(product => product.id === id);
        return foundProduct ? foundProduct : [];
    };

    const getAvailableProductUnit = (id) => {
        const foundProduct = products.data.find(product => product.id === id);
        return foundProduct ? foundProduct : [];
    };


    return (
        <PurchaseContext.Provider value={{
            products, suppliers, warehouses,
            searchQuery, setSearchQuery,
            searchResult, setSearchResult,
            data, setData, post, processing, errors,
            getProductById,
            getAvailableProductUnit,
            handleAddToCart,
            handleUpdateCartItem,
            handleRemoveFromCart,
        }}>
            {children}
        </PurchaseContext.Provider>
    )
}

export { PurchaseContext, PurchaseProductProvider }
