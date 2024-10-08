import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

import AuthLayout from '../../Layouts/AuthLayout'
import { Card, CardBody, CardHeader, CardFooter } from '../../components/Card';
import Button from '../../components/Button';
import InputLabel from '../../components/InputLabel';
import InvalidFeedback from '../../components/InvalidFeedback';
import FormSelect from '../../components/FormSelect';


const MySetting = ({ mySettingData, customers, finance_years, warehouses }) => {

    console.log(mySettingData)

    const { data, setData, post, errors, processing } = useForm({
        _method: "PUT",
        default_finance_year: mySettingData.default_finance_year || "",
        default_customer: mySettingData.default_customer || "",
        default_warehouse: mySettingData.default_warehouse || ""
    });

    const handleSubmit = () => {
        post(route('my-setting.update', mySettingData.id))
    }

    return (
        <>
            <AuthLayout>
                <Head title='Setting | My Setting - ' />
                <Card>
                    <CardHeader>
                        <h4 className='card-title'>My Setting</h4>
                        <p className='card-title-desc'>View and manage setting</p>
                    </CardHeader>
                    <CardBody>
                        <div className="row">

                            {/* customer input */}
                            <div className="col-md-4">
                                <div className="mb-3">
                                    <InputLabel label={"Default Customer"} />
                                    <FormSelect
                                        defaultValue={data.default_customer}
                                        onChange={(e) => setData('default_customer', e.target.value)}
                                    >
                                        {customers.map((customer, index) => <option key={index} value={customer.id}>{customer.name}  - {customer.phone}</option>)}
                                    </FormSelect>
                                    {errors.default_customer && <InvalidFeedback errorMsg={errors.default_customer} />}
                                </div>
                            </div>

                            {/* finance year input */}
                            <div className="col-md-4">
                                <div className="mb-3">
                                    <InputLabel label={"Default Finance Year"} />
                                    <FormSelect
                                        defaultValue={data.default_finance_year}
                                        onChange={(e) => setData('default_finance_year', e.target.value)}
                                    >
                                        {finance_years.map((financeYear, index) => <option key={index} value={financeYear.id}>{financeYear.name}</option>)}
                                    </FormSelect>
                                    {errors.default_finance_year && <InvalidFeedback errorMsg={errors.default_finance_year} />}
                                </div>
                            </div>

                            {/* warehouse input */}
                            <div className="col-md-4">
                                <div className="mb-3">
                                    <InputLabel label={"Default Warehouse"} />
                                    <FormSelect
                                        defaultValue={data.default_warehouse}
                                        onChange={(e) => setData('default_warehouse', e.target.value)}
                                    >
                                        {warehouses.map((warehouse, index) => <option key={index} value={warehouse.id}>{warehouse.name}</option>)}
                                    </FormSelect>
                                    {errors.warehouse && <InvalidFeedback errorMsg={errors.warehouse} />}
                                </div>
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
                                {processing ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </AuthLayout>
        </>
    );
}

export default MySetting;