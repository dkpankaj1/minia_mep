import React, { useState, useEffect, useCallback } from 'react';
import AuthLayout from '../../Layouts/AuthLayout';
import { Card, CardBody, CardHeader, CardFooter } from '../../components/Card';
import { CustomTable, THead, THeader, TBody, TRow, TData } from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import FormSelect from '../../components/FormSelect';
import InputLabel from '../../components/InputLabel';
import InvalidFeedback from '../../components/InvalidFeedback';
import { Head, useForm, usePage } from '@inertiajs/react';
import ModalEditCartItem from './ModalEditCartItem';

function Edit({ purchase, products, suppliers, warehouses }) {
  console.log(purchase)
  const purchaseData = purchase.data
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const { data, setData, put, processing, errors } = useForm({
    date: purchaseData.date,
    reference: purchaseData.reference,
    supplier: purchaseData.supplier,
    warehouse: purchaseData.warehouse,
    order_status: purchaseData.order_status,
    purchase_item: purchaseData.purchase_item,
    shipping_cost: purchaseData.shipping_cost,
    other_cost: purchaseData.other_cost,
    order_tax: purchaseData.order_tax,
    discount_method: purchaseData.discount_method,
    discount: purchaseData.discount,
    note: purchaseData.note || ""
  });

  const [selectedCartItem, setSelectedCartItem] = useState({
    index: null,
    cost: "",
    batch: "",
    expiration: "",
    quantity: "",
    discount: "",
    discountMethod: "",
    taxRate: "",
    purchaseUnit: "",
    availableUnit: []
  });

  // State for computed values
  const [computedValues, setComputedValues] = useState({
    subtotal: 0,
    orderTax: 0,
    totalDiscount: 0,
    grandTotal: 0
  });

  const { system } = usePage().props


  const toggleModal = useCallback(() => setShowModel(prev => !prev), []);

  const handleAddToCart = (product) => {
    const newItem = {
      product_id: product.id,
      code: product.code,
      name: product.name,
      purchase_unit_id: product.unit,
      available_units: product.available_unit,
      net_unit_cost: product.cost,
      quantity: 1,
      discount_method: "0",
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
  };

  const handleRemoveFromCart = (index) => {
    const updatedCartItems = [...data.purchase_item];
    updatedCartItems.splice(index, 1);
    setData("purchase_item", updatedCartItems);
  };

  const handleEditCartItem = (index) => {
    const cart = data.purchase_item[index];
    setSelectedCartItem({
      index: index,
      net_unit_cost: cart.net_unit_cost,
      is_batch: cart.is_batch,
      batch: cart.batch,
      expiration: cart.expiration,
      quantity: cart.quantity,
      discount: cart.discount,
      discountMethod: cart.discount_method,
      taxMethod: cart.tax_method,
      taxRate: cart.tax_rate,
      purchaseUnit: cart.purchase_unit_id,
      availableUnit: cart.available_units
    });
    toggleModal();
  };

  const handleUpdate = () => {
    const updatedCartItem = {
      ...data.purchase_item[selectedCartItem.index],
      net_unit_cost: selectedCartItem.net_unit_cost,
      batch: selectedCartItem.batch,
      expiration: selectedCartItem.expiration,
      quantity: selectedCartItem.quantity,
      discount: selectedCartItem.discount,
      discount_method: selectedCartItem.discountMethod,
      tax_method: selectedCartItem.taxMethod,
      tax_rate: selectedCartItem.taxRate,
      purchase_unit_id: selectedCartItem.purchaseUnit
    };

    const updatedCartItems = [...data.purchase_item];
    updatedCartItems[selectedCartItem.index] = updatedCartItem;

    setData("purchase_item", updatedCartItems);
    toggleModal();
  };

  // Helper functions for calculations
  const calculateSubtotal = () => {
    return data.purchase_item.reduce((total, item) => {
      return total + calculateSubTotalCartItem(item);
    }, 0);
  };

  const calculateOrderTax = (subtotal) => {
    return (subtotal * (data.order_tax / 100) || 0)
  };

  const calculateTotalDiscount = (subtotal) => {
    if (data.discount_method == 0) {
      return data.discount;
    } else {
      return (subtotal * (data.discount / 100));
    }
  };

  const calculateGrandTotal = (subtotal, orderTax, totalDiscount) => {

    return (subtotal + orderTax - totalDiscount + parseFloat(data.shipping_cost) + parseFloat(data.other_cost));
  };

  const calculateSubTotalCartItem = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const netUnitCost = parseFloat(item.net_unit_cost) || 0;
    const discount = parseFloat(item.discount) || 0;
    const taxRate = parseFloat(item.tax_rate) || 0;
    const itemUnit = item.available_units.find((unit) => unit.id == item.purchase_unit_id);
    const unitOperator = itemUnit.operator;
    const operatorValue = parseFloat(itemUnit.operator_value) || 1;

    const calculateDiscountedCost = (cost, discount, method) =>
      method === "0" ? cost - discount : cost - (cost * discount / 100);

    const calculateTaxedCost = (cost, taxRate, method) =>
      method === "0" ? cost : cost + (cost * taxRate / 100);

    const netCostAfterDiscount = calculateDiscountedCost(netUnitCost, discount, item.discount_method);
    const netCostAfterTax = calculateTaxedCost(netCostAfterDiscount, taxRate, item.tax_method);

    return unitOperator === "/"
      ? (quantity * netCostAfterTax / operatorValue)
      : quantity * netCostAfterTax;
  };


  const getCartItemUnit = (item) => {
    const itemUnit = item.available_units.find((unit) => unit.id == item.purchase_unit_id);
    return itemUnit?.short_name || "";
  }


  const getCartItemDiscount = (item) => {
    const itemUnit = item.available_units.find((unit) => unit.id == item.purchase_unit_id);
    const operatorValue = parseFloat(itemUnit.operator_value) || 1;
    const quantity = parseFloat(item.quantity) || 0;
    const netUnitCost = parseFloat(item.net_unit_cost) || 0;
    const discount = parseFloat(item.discount) || 0;

    const calculateDiscount = (cost, discount, method) =>
      method === "0" ? discount * quantity : cost * discount / 100;

    const discountValue = calculateDiscount(netUnitCost, discount, item.discount_method);
    return discountValue;
  };



  const calculateTotals = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const orderTax = parseFloat(calculateOrderTax(subtotal));
    const totalDiscount = parseFloat(calculateTotalDiscount(subtotal));
    const grandTotal = calculateGrandTotal(subtotal, orderTax, totalDiscount);

    setComputedValues({
      subtotal,
      orderTax,
      totalDiscount,
      grandTotal
    });
  };


  useEffect(() => {
    if (searchQuery === "") {
      setSearchResult([]);
    } else {
      const timeOutId = setTimeout(() => {
        const filteredProduct = products.data.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResult(filteredProduct);
      }, 500);
      return () => clearTimeout(timeOutId);
    }
  }, [searchQuery]);

  useEffect(() => {
    calculateTotals();
  }, [data]);


  const handleSubmit = () => {
    console.log(data);
    put(route('purchase.update',purchaseData.id))
  };

  return (
    <AuthLayout>
      <Head title='Purchase | Create - ' />
      <Card>
        <CardHeader>
          <h4 className='card-title'>Create Purchase</h4>
          <p className='card-title-desc'>Fill out the form below to create a new Purchase.</p>
        </CardHeader>
        <CardBody>
          <div className="row">
            {/* date input */}
            <div className="col-md-4">
              <div className="mb-4">
                <InputLabel label={"Date"} />
                <FormInput
                  type="date"
                  className="form-control"
                  value={data.date}
                  onChange={(e) => setData('date', e.target.value)}
                />
                {errors.date && <InvalidFeedback errorMsg={errors.date} />}
              </div>
            </div>

            {/* reference input */}
            <div className="col-md-4">
              <div className="mb-4">
                <InputLabel label={"Reference"} />
                <FormInput
                  type="text"
                  className="form-control"
                  placeholder="Enter Reference Number"
                  value={data.reference}
                  onChange={(e) => setData('reference', e.target.value)}
                />
                {errors.reference && <InvalidFeedback errorMsg={errors.reference} />}
              </div>
            </div>

            <div className="w-100"></div>

            {/* supplier input */}
            <div className="col-md-4">
              <div className="mb-4">
                <InputLabel label={"Supplier"} />
                <FormSelect
                  className="form-select"
                  value={data.supplier}
                  onChange={(e) => setData('supplier', e.target.value)}
                >
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                  ))}
                </FormSelect>
                {errors.supplier && <InvalidFeedback errorMsg={errors.supplier} />}
              </div>
            </div>

            {/* warehouse input */}
            <div className="col-md-4">
              <div className="mb-4">
                <InputLabel label={"Warehouse"} />
                <FormSelect
                  className="form-select"
                  value={data.warehouse}
                  onChange={(e) => setData('warehouse', e.target.value)}
                >
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                  ))}
                </FormSelect>
                {errors.warehouse && <InvalidFeedback errorMsg={errors.warehouse} />}
              </div>
            </div>

            {/* order status input */}
            <div className="col-md-4">
              <div className="mb-4">
                <InputLabel label={"Order Status"} />
                <FormSelect defaultValue={data.order_status} onChange={e => setData('order_status', e.target.value)}>
                  <option value={"generated"}>{"Generated"}</option>
                  <option value={"pending"}>{"Pending"}</option>
                  <option value={"received"}>{"Received"}</option>
                </FormSelect>

                {errors.order_status && <InvalidFeedback errorMsg={errors.order_status} />}
              </div>
            </div>

          </div>

          {/* search Product input */}
          <div className="col-12">
            <div className="mb-4">
              <InputLabel label={"Product"} />

              <div className="input-group">
                <div className="input-group-text px-4 search-input-prefix">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upc-scan" viewBox="0 0 16 16">
                    <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5M3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0z" />
                  </svg>
                </div>
                <FormInput
                  className="form-control py-3 search-input"
                  // style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                  placeholder={"Scan/Search Product"}
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              {searchResult.length > 0 && <ul className='searchResultContainer'>
                {searchResult.map((result, index) => <li key={index} className='searchResultItem' onClick={() => handleAddToCart(result)}> {result.code} | {result.name}</li>)}
              </ul>}
            </div>
          </div>
          <div className="table-responsive">
            <CustomTable className='no-wrap'>
              <THead className="table-secondary">
                <TRow>
                  <THeader>No.</THeader>
                  <THeader>Product</THeader>
                  <THeader>Net Unit Cost ({system.currency.symbol})</THeader>
                  <THeader>Qty</THeader>
                  <THeader>Batch</THeader>
                  <THeader>Expiry</THeader>
                  <THeader>Tax (%)</THeader>
                  <THeader>Discount ({system.currency.symbol})</THeader>
                  <THeader>Subtotal</THeader>
                  <THeader>Action</THeader>
                </TRow>
              </THead>
              <TBody>
                {data.purchase_item.length <= 0 ? (
                  <TRow>
                    <TData colSpan="10">No data available.</TData>
                  </TRow>
                ) : (
                  data.purchase_item.map((item, index) => (
                    <TRow key={index}>
                      <TData>{index + 1}</TData>
                      <TData>
                        <span>{item.code}</span> &nbsp;|&nbsp;
                        <span><b>{item.name}</b></span>
                      </TData>
                      <TData>
                        {system.currency.symbol}
                        {item.net_unit_cost}
                        {errors[`purchase_item.${index}.net_unit_cost`] && (
                          <InvalidFeedback errorMsg={errors[`purchase_item.${index}.net_unit_cost`]} />
                        )}
                      </TData>
                      <TData>
                        <Badge className='rounded-pill font-size-14 fw-medium bg-success-subtle text-success'>
                          {item.quantity} {getCartItemUnit(item)}
                        </Badge>
                        {errors[`purchase_item.${index}.quantity`] && (
                          <InvalidFeedback errorMsg={errors[`purchase_item.${index}.quantity`]} />
                        )}
                      </TData>
                      <TData>
                        {item.is_batch == 1 && (
                          <>
                            <Badge className={`font-size-14 fw-medium ${item.batch ? "bg-info-subtle text-info" : "bg-danger-subtle text-danger"} `}
                              style={{ cursor: "pointer" }} onClick={() => handleEditCartItem(index)}
                            >
                              {item.batch || "click to edit"}
                            </Badge>
                            {errors[`purchase_item.${index}.batch`] && (
                              <InvalidFeedback errorMsg={errors[`purchase_item.${index}.batch`]} />
                            )}
                          </>
                        )}
                      </TData>
                      <TData>
                        {item.is_batch == 1 && (
                          <>
                            <Badge className={`font-size-14 fw-medium ${item.expiration ? "bg-info-subtle text-info" : "bg-danger-subtle text-danger"} `}
                              style={{ cursor: "pointer" }} onClick={() => handleEditCartItem(index)}>
                              {item.expiration || "click to edit"}
                            </Badge>
                            {errors[`purchase_item.${index}.expiration`] && (
                              <InvalidFeedback errorMsg={errors[`purchase_item.${index}.expiration`]} />
                            )}
                          </>
                        )}
                      </TData>
                      <TData>{item.tax_rate} %</TData>
                      <TData>{system.currency.symbol} {item.discount_method == 0 ? item.discount : item.net_unit_cost * (item.discount / 100)}
                      </TData>
                      <TData>
                        {system.currency.symbol} {calculateSubTotalCartItem(item).toFixed(2)}
                      </TData>
                      <TData>
                        <div className="d-flex gap-2">
                          <Button className="btn btn-sm btn-soft-primary" onClick={() => handleEditCartItem(index)}>
                            <i className="bx bxs-edit font-size-12 align-middle"></i>
                          </Button>
                          <Button className="btn btn-sm btn-soft-danger" onClick={() => handleRemoveFromCart(index)}>
                            <i className="bx bxs-trash font-size-12 align-middle"></i>
                          </Button>
                        </div>
                      </TData>
                    </TRow>
                  ))
                )}
                <TRow>
                  <TData colSpan="7"></TData>
                  <TData colSpan="4">
                    <CustomTable className='table table-striped table-sm'>
                      <TBody>
                        <TRow>
                          <TData><b>Tax ({system.currency.symbol})</b></TData>
                          <TData> {(computedValues.orderTax).toFixed(2)}</TData>
                        </TRow>
                        <TRow>
                          <TData><b>Discount ({system.currency.symbol})</b></TData>
                          <TData>{(computedValues.totalDiscount).toFixed(2)}</TData>
                        </TRow>
                        <TRow>
                          <TData><b>Total ({system.currency.symbol})</b></TData>
                          <TData> {(computedValues.subtotal).toFixed(2)}</TData>
                        </TRow>
                        <TRow>
                          <TData><b>Grand Total ({system.currency.symbol})</b></TData>
                          <TData>{(computedValues.grandTotal).toFixed(2)}</TData>
                        </TRow>
                      </TBody>
                    </CustomTable>
                  </TData>
                </TRow>
              </TBody>
            </CustomTable>
            {errors.purchase_item && <InvalidFeedback errorMsg={errors.purchase_item} />}
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <InputLabel label={`Shipping Cost (${system.currency.symbol})`} />
                <FormInput
                  type="number"
                  className="form-control"
                  value={data.shipping_cost}
                  onChange={(e) => setData('shipping_cost', e.target.value)}
                />
                {errors.shipping_cost && <InvalidFeedback errorMsg={errors.shipping_cost} />}
              </div>
            </div>

            <div className="col-md-4">
              <div className="mb-3">
                <InputLabel label={`Other Cost (${system.currency.symbol})`} />
                <FormInput
                  type="number"
                  className="form-control"
                  value={data.other_cost}
                  onChange={(e) => setData('other_cost', e.target.value)}
                />
                {errors.other_cost && <InvalidFeedback errorMsg={errors.other_cost} />}
              </div>
            </div>

            <div className="col-md-4">
              <div className="mb-3">
                <InputLabel label={"Order Tax (%)"} />
                <FormInput
                  min={0}
                  max={100}
                  step={0.1}
                  type="number"
                  className="form-control"
                  value={data.order_tax}
                  onChange={(e) => setData('order_tax', e.target.value)}
                />
                {errors.order_tax && <InvalidFeedback errorMsg={errors.order_tax} />}
              </div>
            </div>

            <div className="col-md-4">
              <div className="mb-3">
                <InputLabel label={"Discount Type"} />
                <FormSelect
                  className="form-select"
                  value={data.discount_method}
                  onChange={(e) => setData('discount_method', e.target.value)}
                >
                  <option value="0">Fixed</option>
                  <option value="1">Percent</option>
                </FormSelect>
                {errors.discount_method && <InvalidFeedback errorMsg={errors.discount_method} />}
              </div>
            </div>

            <div className="col-md-4">
              <div className="mb-3">
                <InputLabel label={"Discount"} />
                <FormInput
                  type="number"
                  className="form-control"
                  value={data.discount}
                  onChange={(e) => setData('discount', e.target.value)}
                />
                {errors.discount && <InvalidFeedback errorMsg={errors.discount} />}
              </div>
            </div>

            <div className="col-md-12">
              <div className="mb-3">
                <InputLabel label={"Note"} />
                <textarea
                  type="text"
                  className="form-control"
                  value={data.note}
                  onChange={(e) => setData('note', e.target.value)}
                />
                {errors.note && <InvalidFeedback errorMsg={errors.note} />}
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <Button className="btn btn-primary w-md" onClick={handleSubmit} disabled={processing}>Save</Button>
        </CardFooter>
      </Card>

      <ModalEditCartItem
        showModel={showModel}
        toggleModal={toggleModal}
        selectedCartItem={selectedCartItem}
        setSelectedCartItem={setSelectedCartItem}
        handleUpdate={handleUpdate}
        system={system}
      />
    </AuthLayout >
  );
}

export default Edit;
