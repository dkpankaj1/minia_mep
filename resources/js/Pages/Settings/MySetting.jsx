import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

import AuthLayout from '../../Layouts/AuthLayout'
import { Card, CardBody, CardHeader, CardFooter } from '../../components/Card';
import Button from '../../components/Button';
import InputLabel from '../../components/InputLabel';
import FormInput from '../../components/FormInput';
import InvalidFeedback from '../../components/InvalidFeedback';
import FormSelect from '../../components/FormSelect';
import IsAuthorize from '../../components/IsAuthorize';


const MySetting = ({ mySettingData, finance_years }) => {

    console.log(mySettingData)

    const { data, setData, post, errors, processing } = useForm({
        _method: "PUT",
        default_finance_year: mySettingData.default_finance_year,
    });

    const handleSubmit = () => {
        // console.log(data)
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
                            
                        </div>



                    </CardBody>

                    <IsAuthorize ability={'company.edit'}>
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
                    </IsAuthorize>
                </Card>

            </AuthLayout>

        </>
    );
}

export default MySetting;