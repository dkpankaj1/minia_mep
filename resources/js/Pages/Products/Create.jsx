import React, { useEffect, useState } from 'react'
import AuthLayout from '../../Layouts/AuthLayout'
import { Head, useForm } from '@inertiajs/react'

import { Card, CardBody, CardHeader, CardFooter } from '../../components/Card';
import Button from '../../components/Button';
import InputLabel from '../../components/InputLabel';
import FormInput from '../../components/FormInput';
import InvalidFeedback from '../../components/InvalidFeedback';
import FormSelect from '../../components/FormSelect';
import ImageUploadPreview from './ImageUploadPreview';

function Create({ categories, units, brands }) {

  const [availableUnit, setAvailableUnit] = useState([])
  const [subcategories, setSubCategories] = useState([])
  const { data, setData, post, processing, errors } = useForm({
    code: "",
    barcode_symbology: "",
    category: "",
    sub_category: "",
    brand: "",
    name: "",
    unit: "",
    purchase_unit: "",
    sale_unit: "",
    cost: 0,
    price: 0,
    tax_method: "",
    net_tax: 0,
    is_batch: false,
    expiration_alert: "",
    stock_alert: 0,
    image: undefined,
    is_active: "",
    description: "",
  })

  const handleChangeCategory = (e) => {
    const selectedCategory = categories.find((category) => {
      return category.id == e.target.value;
    });
    setData({
      ...data,
      category: e.target.value,
      sub_category: ""
    })
    setSubCategories(selectedCategory?.sub_category || [])
  }

  const handelChangeUnit = (e) => {
    const selectedUnit = units.find(unit => unit.id == e.target.value);
    setAvailableUnit([selectedUnit, ...selectedUnit.sub_units])
    setData({
      ...data,
      unit: e.target.value,
      sale_unit: "",
      purchase_unit: ""
    })
  }

  const handleIsBatchCheck = (e) => {
    setData({
      ...data,
      expiration_alert: "",
      is_batch: e.target.checked
    })
  }

  const handleSubmit = () => {
    console.log(data)
    post(route('product.store'))
  }

  return (
    <AuthLayout>
      <Head title='Product | Create - ' />

      <Card>
        <CardHeader>
          <h4 className='card-title'>Create Product</h4>
          <p className='card-title-desc'>Fill out the form below to create a new product.</p>
        </CardHeader>

        <CardBody>

          <div className="row">

            {/* form inputs col-9 */}
            <div className="col-md-9">


              <div className="row">

                {/* name input */}
                <div className="col-md-6">
                  <div className="mb-4">
                    <InputLabel label={"Name"} />
                    <FormInput
                      type="text"
                      className="form-control"
                      placeholder="Enter Product Name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                    />
                    {errors.name && <InvalidFeedback errorMsg={errors.name} />}
                  </div>
                </div>

                {/* code input */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <InputLabel label={"Code"} />
                    <FormInput
                      type="text"
                      className="form-control"
                      placeholder="Enter Product Code"
                      value={data.code}
                      onChange={(e) => setData('code', e.target.value)}
                    />
                    {errors.code && <InvalidFeedback errorMsg={errors.code} />}
                  </div>
                </div>

                <div className="w-100"></div>

                {/* category input */}
                <div className="col-md-4">
                  <div className="mb-3">
                    <InputLabel label={"Category"} />
                    <FormSelect
                      defaultValue={data.category}
                      onChange={e => handleChangeCategory(e)}
                    >
                      {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}

                    </FormSelect>
                    {errors.category && <InvalidFeedback errorMsg={errors.category} />}
                  </div>
                </div>

                {/* sub category input */}
                <div className="col-md-4">
                  <div className="mb-3">
                    <InputLabel label={"Sub Category"} />
                    <FormSelect
                      defaultValue={data.sub_category}
                      onChange={e => setData('sub_category', e.target.value)}
                    >
                      {subcategories.map((subCategory) => <option key={subCategory.id} value={subCategory.id}>{subCategory.name}</option>)}

                    </FormSelect>
                    {errors.sub_category && <InvalidFeedback errorMsg={errors.sub_category} />}
                  </div>
                </div>

                {/* barcode symbology input */}
                <div className="col-md-4">
                  <div className="mb-3">
                    <InputLabel label={"Barcode Symbology"} />
                    <FormSelect
                      defaultValue={data.barcode_symbology}
                      onChange={(e) => setData('barcode_symbology', e.target.value)}
                    >
                      <option value="C128">C128</option>
                      <option value="C39">C39</option>
                      <option value="EAN13">EAN13</option>
                      <option value="UPCA">UPCA</option>
                      <option value="C93">C93</option>
                      <option value="EAN8">EAN8</option>
                      <option value="QRCODE">QRCODE</option>
                      <option value="PDF417">PDF417</option>
                      <option value="DATAMATRIX">DATAMATRIX</option>
                    </FormSelect>
                    {errors.barcode_symbology && <InvalidFeedback errorMsg={errors.barcode_symbology} />}
                  </div>
                </div>

                {/* brand input */}
                <div className="col-md-4">
                  <div className="mb-3">
                    <InputLabel label={"Brand"} />
                    <FormSelect
                      defaultValue={data.brand}
                      onChange={(e) => setData('brand', e.target.value)}
                    >
                      {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}

                    </FormSelect>
                    {errors.brand && <InvalidFeedback errorMsg={errors.brand} />}
                  </div>
                </div>

                {/* Product Cost input */}
                <div className="col-md-4">
                  <div className="mb-3">
                    <InputLabel label={"Product Cost"} />
                    <FormInput
                      type="text"
                      className="form-control"
                      placeholder="Enter Product Cost"
                      value={data.cost}
                      onChange={(e) => setData('cost', e.target.value)}
                    />
                    {errors.cost && <InvalidFeedback errorMsg={errors.cost} />}
                  </div>
                </div>

                {/* Product Price input */}
                <div className="col-md-4">
                  <div className="mb-3">
                    <InputLabel label={"Product Price"} />
                    <FormInput
                      type="text"
                      className="form-control"
                      placeholder="Enter Product Price"
                      value={data.price}
                      onChange={(e) => setData('price', e.target.value)}
                    />
                    {errors.price && <InvalidFeedback errorMsg={errors.price} />}
                  </div>
                </div>

                {/* unit input */}
                <div className="col-md-4">
                  <div className="mb-3">
                    <InputLabel label={"Unit"} />
                    <FormSelect
                      defaultValue={data.unit}
                      onChange={(e) => handelChangeUnit(e)}
                    >
                      {units.map((unit) => <option key={unit.id} value={unit.id}>{unit.name} ({unit.short_name})</option>)}

                    </FormSelect>
                    {errors.unit && <InvalidFeedback errorMsg={errors.unit} />}
                  </div>
                </div>

                {/* purchase unit input */}
                <div className="col-md-4">
                  <div className="mb-3">
                    <InputLabel label={"Purchase Unit"} />
                    <FormSelect
                      defaultValue={data.purchase_unit}
                      onChange={(e) => setData('purchase_unit', e.target.value)}
                    >
                      {availableUnit.map((unit) => <option key={unit.id} value={unit.id}>{unit.name} ({unit.short_name})</option>)}

                    </FormSelect>
                    {errors.purchase_unit && <InvalidFeedback errorMsg={errors.purchase_unit} />}
                  </div>
                </div>

                {/* sale unit input */}
                <div className="col-md-4">
                  <div className="mb-3">
                    <InputLabel label={"Sale Unit"} />
                    <FormSelect
                      defaultValue={data.sale_unit}
                      onChange={(e) => setData('sale_unit', e.target.value)}
                    >
                      {availableUnit.map((unit) => <option key={unit.id} value={unit.id}>{unit.name} ({unit.short_name})</option>)}

                    </FormSelect>
                    {errors.sale_unit && <InvalidFeedback errorMsg={errors.sale_unit} />}
                  </div>
                </div>

                {/* tex_method input */}
                <div className="col-md-4">
                  <div className="mb-3">
                    <InputLabel label={"Tax Type"} />
                    <FormSelect
                      defaultValue={data.tax_method}
                      onChange={(e) => setData('tax_method', e.target.value)}
                    >
                      <option value="inclusive">Inclusive</option>
                      <option value="exclusive">Exclusive </option>
                    </FormSelect>
                    {errors.tax_method && <InvalidFeedback errorMsg={errors.tax_method} />}
                  </div>
                </div>

                {/* order_tex input */}
                <div className="col-md-4">
                  <div className="mb-3">
                    <InputLabel label={"Order Tax"} />
                    <div className="input-group">
                      <FormInput
                        type="number"
                        step={'0.1'}
                        className="form-control"
                        placeholder="Enter Product Code"
                        value={data.net_tax}
                        onChange={(e) => setData('net_tax', e.target.value)}
                      />
                      <div className="input-group-text">%</div>
                    </div>
                    {errors.net_tax && <InvalidFeedback errorMsg={errors.net_tax} />}
                  </div>
                </div>

                {/* stock alert input */}
                <div className="col-md-4">
                  <div className="mb-3">
                    <InputLabel label={"Stock Alert"} />
                    <FormInput
                      type="number"
                      className="form-control"
                      placeholder="Stock Alert Quantity"
                      value={data.stock_alert}
                      onChange={(e) => setData('stock_alert', e.target.value)}
                    />
                    {errors.stock_alert && <InvalidFeedback errorMsg={errors.stock_alert} />}
                  </div>
                </div>

                <div className="w-100"></div>

                {/* status input */}
                <div className="col-md-4">
                  <div className="mb-3">
                    <InputLabel label={"Is Active"} />
                    <FormSelect
                      defaultValue={data.is_active}
                      onChange={(e) => setData('is_active', e.target.value)}
                    >
                      <option value="1">Active</option>
                      <option value="0">InActive</option>
                    </FormSelect>
                    {errors.is_active && <InvalidFeedback errorMsg={errors.is_active} />}
                  </div>
                </div>
              </div>

              <div className="w-100"></div>

              {/* stock alert input */}
              <div className="col-12">
                <div className="mb-3">
                  <InputLabel label={"Description"} />
                  <textarea
                    className="form-control"
                    placeholder="Enter Product Description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                  ></textarea>
                  {errors.description && <InvalidFeedback errorMsg={errors.description} />}
                </div>
              </div>

            </div>

            {/* form inputs col-3  */}
            <div className="col-md-3">
              {/* image input */}
              <div className="mb-3">
                <ImageUploadPreview setData={setData} errors={errors} />
              </div>

              {/* batch and expiration input */}
              <div className="mb-3">
                <div className="form-check">
                  <FormInput
                    type="checkbox"
                    className="form-check-input"
                    checked={data.is_batch}
                    onChange={e => handleIsBatchCheck(e)}
                  />
                  <InputLabel className='text-primary' label={"Product Has Batch And Expiration"} />
                </div>
                {errors.is_batch && <InvalidFeedback errorMsg={errors.is_batch} />}
              </div>

              {/* expiration alert input */}
              {data.is_batch == true && (<div className="mb-3">
                <InputLabel label={"Expiration Alert (in day)"} />
                <FormInput
                  type="number"
                  className="form-control"
                  checked={data.expiration_alert}
                  onChange={e => setData('expiration_alert', e.target.value)}
                  placeholder="Enter expiration alert"
                />
                {errors.expiration_alert && <InvalidFeedback errorMsg={errors.expiration_alert} />}
              </div>)}

            </div>
          </div>


        </CardBody>

        <CardFooter>
          <div className="d-flex justify-content-start">
            <Button
              type="submit"
              className="btn btn-primary w-md"
              onClick={handleSubmit}
              disabled={processing}
            >
              {processing ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </CardFooter>
      </Card>

    </AuthLayout>
  )
}

export default Create