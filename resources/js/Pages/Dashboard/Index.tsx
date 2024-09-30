import React from "react";
import AuthLayout from "../../Layouts/AuthLayout";
import ActivityLog from "./ActivityLog";
import { usePage } from "@inertiajs/react";
import { PageProp } from "@/types/global";
import { TSystemPagePropType } from "@/types/type";

export interface ILogType {
    date: string;
    message: string;
    type: string;
}

interface PropTypes {
    logs: ILogType[];
}
interface UserType extends PageProp {
    auth: {
        user: {
            user: {
                name: string;
                email: string;
                image: string;
                avatar: string;
            };
            roles: Array<string>;
        };
    };
    system: TSystemPagePropType;
}

function Index({ logs }: PropTypes) {
    const { auth, system } = usePage<UserType>().props;
    return (
        <AuthLayout>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-sm order-2 order-sm-1">
                                    <div className="d-flex align-items-start mt-3 mt-sm-0">
                                        <div className="flex-shrink-0">
                                            <div className="avatar-xl me-3">
                                                <img
                                                    src={auth.user.user.avatar}
                                                    alt=""
                                                    className="img-fluid rounded-circle d-block"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-grow-1">
                                            <div>
                                                <h5 className="font-size-16 mb-1">
                                                    Welcome,{" "}
                                                    {auth.user.user.name}
                                                </h5>
                                                <p className="text-muted font-size-13">
                                                    {auth.user.roles[0]}
                                                </p>

                                                <div className="d-flex flex-wrap align-items-start gap-2 gap-lg-3 text-muted font-size-13">
                                                    <div>
                                                        <i className="mdi mdi-circle-medium me-1 text-success align-middle"></i>
                                                        {auth.user.user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-3 col-md-6">
                    <div className="card card-h-100">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-6">
                                    <span className="text-dark mb-3 lh-1 d-block text-truncate">
                                        Today Sale
                                    </span>
                                    <h4 className="mb-3">
                                        {system.currency.symbol}
                                        <span
                                            className="counter-value"
                                            data-target="865.2"
                                        >
                                            0
                                        </span>
                                        k
                                    </h4>
                                </div>
                            </div>
                            <div className="text-nowrap border-top ">
                                <button className="btn btn-sm btn-primary mt-2 px-4">
                                    <i className="fas fa-arrow-right "></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="card card-h-100">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-6">
                                    <span className="text-dark mb-3 lh-1 d-block text-truncate">
                                        Today Purchase
                                    </span>
                                    <h4 className="mb-3">
                                        {system.currency.symbol}
                                        <span
                                            className="counter-value"
                                            data-target="865.2"
                                        >
                                            0
                                        </span>
                                        k
                                    </h4>
                                </div>
                            </div>
                            <div className="text-nowrap border-top ">
                                <button className="btn btn-sm btn-primary mt-2 px-4">
                                    <i className="fas fa-arrow-right "></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="card card-h-100">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-6">
                                    <span className="text-dark mb-3 lh-1 d-block text-truncate">
                                        Today payment
                                    </span>
                                    <h4 className="mb-3">
                                        {system.currency.symbol}
                                        <span
                                            className="counter-value"
                                            data-target="865.2"
                                        >
                                            0
                                        </span>
                                        k
                                    </h4>
                                </div>
                            </div>
                            <div className="text-nowrap border-top ">
                                <button className="btn btn-sm btn-primary mt-2 px-4">
                                    <i className="fas fa-arrow-right "></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="card card-h-100">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-6">
                                    <span className="text-dark mb-3 lh-1 d-block text-truncate">
                                        Today Due
                                    </span>
                                    <h4 className="mb-3">
                                        {system.currency.symbol}
                                        <span
                                            className="counter-value"
                                            data-target="865.2"
                                        >
                                            0
                                        </span>
                                        k
                                    </h4>
                                </div>
                            </div>
                            <div className="text-nowrap border-top ">
                                <button className="btn btn-sm btn-primary mt-2 px-4">
                                    <i className="fas fa-arrow-right "></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="card card-h-100">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-6">
                                    <span className="text-dark mb-3 lh-1 d-block text-truncate">
                                        Total Sale
                                    </span>
                                    <h4 className="mb-3">
                                        {system.currency.symbol}
                                        <span
                                            className="counter-value"
                                            data-target="865.2"
                                        >
                                            0
                                        </span>
                                        k
                                    </h4>
                                </div>
                            </div>
                            <div className="text-nowrap border-top ">
                                <button className="btn btn-sm btn-primary mt-2 px-4">
                                    <i className="fas fa-arrow-right "></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="card card-h-100">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-6">
                                    <span className="text-dark mb-3 lh-1 d-block text-truncate">
                                        Total Purchase
                                    </span>
                                    <h4 className="mb-3">
                                        {system.currency.symbol}
                                        <span
                                            className="counter-value"
                                            data-target="865.2"
                                        >
                                            0
                                        </span>
                                        k
                                    </h4>
                                </div>
                            </div>
                            <div className="text-nowrap border-top ">
                                <button className="btn btn-sm btn-primary mt-2 px-4">
                                    <i className="fas fa-arrow-right "></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="card card-h-100">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-6">
                                    <span className="text-dark mb-3 lh-1 d-block text-truncate">
                                        Total payment
                                    </span>
                                    <h4 className="mb-3">
                                        {system.currency.symbol}
                                        <span
                                            className="counter-value"
                                            data-target="865.2"
                                        >
                                            0
                                        </span>
                                        k
                                    </h4>
                                </div>
                            </div>
                            <div className="text-nowrap border-top ">
                                <button className="btn btn-sm btn-primary mt-2 px-4">
                                    <i className="fas fa-arrow-right "></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="card card-h-100">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-6">
                                    <span className="text-dark mb-3 lh-1 d-block text-truncate">
                                        Total Due
                                    </span>
                                    <h4 className="mb-3">
                                        {system.currency.symbol}
                                        <span
                                            className="counter-value"
                                            data-target="865.2"
                                        >
                                            0
                                        </span>
                                        k
                                    </h4>
                                </div>
                            </div>
                            <div className="text-nowrap border-top ">
                                <button className="btn btn-sm btn-primary mt-2 px-4">
                                    <i className="fas fa-arrow-right "></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                

            </div>

            <ActivityLog logs={logs} />
        </AuthLayout>
    );
}

export default Index;
