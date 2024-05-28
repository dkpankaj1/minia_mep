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


const SystemSetting = ({ systemSettingData }) => {

    const [logoImagePreview, setLogoImagePreview] = useState(systemSettingData.logo)
    const [faviconImagePreview, setFaviconImagePreview] = useState(systemSettingData.favicon)

    const { data, setData, post, errors, processing } = useForm({
        _method: "PUT",
        app_name: systemSettingData.app_name,
        license: systemSettingData.license,
        logo: undefined,
        favicon: undefined,
    });

    console.log(data)

    const handleLogoImageInput = (e) => {
        setData('logo', e.target.files[0])
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoImagePreview(reader.result);
        };
        reader.readAsDataURL(e.target.files[0]);
    }

    const handleFaviconImageInput = (e) => {
        setData('favicon', e.target.files[0])
        const reader = new FileReader();
        reader.onloadend = () => {
            setFaviconImagePreview(reader.result);
        };
        reader.readAsDataURL(e.target.files[0]);
    }



    const handleSubmit = () => {
        // console.log(data)
        post(route('system.update', systemSettingData.id))
    }


    return (
        <>

            <AuthLayout>
                <Head title='Setting | System - ' />

                <Card>
                    <CardHeader>
                        <h4 className='card-title'>System</h4>
                        <p className='card-title-desc'>View and manage system setting</p>
                    </CardHeader>

                    <CardBody>
                        <div className="row">

                            {/* name input */}
                            <div className="col-md-4">
                                <div className="mb-3">
                                    <InputLabel label={"Application Name"} />
                                    <FormInput
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Application Name"
                                        value={data.app_name}
                                        onChange={(e) => setData('app_name', e.target.value)}
                                    />
                                    {errors.app_name && <InvalidFeedback errorMsg={errors.app_name} />}
                                </div>
                            </div>

                            {/*  license input */}
                            <div className="col-md-4">
                                <div className="mb-3">
                                    <InputLabel label={"Application License"} />
                                    <FormInput
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Application Name"
                                        value={data.license}
                                        onChange={(e) => setData('license', e.target.value)}
                                    />
                                    {errors.license && <InvalidFeedback errorMsg={errors.license} />}
                                </div>
                            </div>

                            <div className="w-100"></div>

                            {/* logo input */}
                            <div className="col-md-4">
                                <div className="mb-3">
                                    <img
                                        src={logoImagePreview}
                                        alt=""
                                        className='border'
                                        style={{ width: "100px" }}
                                    />
                                    <FormInput className="form-control mt-3" type={"file"}
                                        defaultValue={data.logo} onChange={e => handleLogoImageInput(e)}
                                    />
                                    {errors.logo && <InvalidFeedback errorMsg={errors.logo} />}
                                </div>
                            </div>

                            {/* favicon input */}
                            <div className="col-md-4">
                                <div className="mb-3">
                                    <img
                                        src={faviconImagePreview}
                                        alt=""
                                        className='border'
                                        style={{ width: "100px" }}
                                    />
                                    <FormInput className="form-control mt-3" type={"file"}
                                        defaultValue={data.logo} onChange={e => handleFaviconImageInput(e)}
                                    />
                                    {errors.favicon && <InvalidFeedback errorMsg={errors.favicon} />}
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

export default SystemSetting;