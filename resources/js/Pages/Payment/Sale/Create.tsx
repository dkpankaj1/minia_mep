import React, { useEffect, useState } from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import { Card, CardBody, CardHeader, CardFooter } from "@/components/Card";
import InputLabel from "@/components/InputLabel";
import FormSelect from "@/components/FormSelect";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import InvalidFeedback from "@/components/InvalidFeedback";
import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProp } from "@/types/global";
import { TSystemPagePropType } from "@/types/type";
import SearchableSelect from "@/components/SearchableSelect";

interface ICustomerType {
    id: number;
    name: string;
    email: string;
    sales: Array<ISaleType>;
}
interface ISaleType {
    id: number;
    invoice_id: string;
    amount: number;
}
interface ISelectedSale {
    id: number | null;
    customer_id: number | null;
    amount: number;
}
interface TFormDataField {
    date: string | "";
    customer: number | "";
    sale: number | "";
    amount: number | "";
    transaction_id: string | "";
    payment_mode: string | "";
    note: string | "";
}

interface IPagePropsType extends PageProp {
    system: TSystemPagePropType;
}

interface IPropsType {
    customers: Array<ICustomerType>;
    selectedSale: ISelectedSale;
}

const Create = ({ customers, selectedSale }: IPropsType) => {
    const { system } = usePage<IPagePropsType>().props;

    // Get the current date and format it to YYYY-MM-DD
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    const { data, setData, post, processing, errors, clearErrors } =
        useForm<TFormDataField>({
            date: formattedDate,
            customer: selectedSale.customer_id ?? "",
            sale: selectedSale.id ?? "",
            amount: selectedSale.amount ?? 0,
            transaction_id: "",
            payment_mode: "",
            note: "",
        });

    const [sales, setSales] = useState<Array<ISaleType>>([]);

    const formatCustomerToOption: any = customers.map((customer) => {
        return {
            value: customer.id,
            label: `${customer.name} - ${customer.email}`,
        };
    });

    const handleInputChange = (
        field: keyof TFormDataField,
        value: string | number | ""
    ) => {
        clearErrors(field);
        setData(field, value);
    };

    const handleCustomerChange = (customer: any) => {
        clearErrors("customer");
        if (!customer) {
            setData({ ...data, customer: "", sale: "", amount: 0 });
            setSales([]);
        } else {
            const customerId = customer.value;
            setData({
                ...data,
                customer: customerId,
                sale: "",
                amount: 0,
            });

            const selectedCustomer = customers.find(
                ({ id }) => id === customerId
            );
            setSales(selectedCustomer?.sales || []);
        }
    };

    const changeSale = (saleId: number) => {
        clearErrors("sale");

        const foundSale = sales.find((sale) => sale.id == saleId);
        const dueAmt = foundSale ? foundSale.amount : 0;

        setData({
            ...data,
            amount: dueAmt,
            sale: saleId,
        });
    };

    const changeAmount = (amount: number) => {
        clearErrors("amount");

        const foundSale = sales.find((sale) => sale.id == data.sale);
        const dueAmt = foundSale ? foundSale.amount : 0;
        const paidAmt = amount > dueAmt ? dueAmt : amount;

        setData({
            ...data,
            amount: paidAmt,
        });
    };

    const handleSubmit = () => {
        post(route("sale.payment.store"));
    };

    useEffect(() => {
        const customerPurchases = customers.find((customer) => {
            return customer.id == data.customer;
        });
        if (customerPurchases) {
            setSales(customerPurchases.sales);
        }
    }, [data.customer]);

    return (
        <AuthLayout>
            <Head title="Purchase | Payment | Create - " />

            <Card>
                <CardHeader>
                    <h4 className="card-title">Create Payment</h4>
                    <p className="card-title-desc">
                        Fill out the form below to create a new Payment.
                    </p>
                </CardHeader>

                <CardBody>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="mb-3">
                                        <InputLabel label={"Date"} />
                                        <FormInput
                                            type="date"
                                            className={
                                                errors.date
                                                    ? "form-control is-invalid"
                                                    : "form-control"
                                            }
                                            value={data.date}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) =>
                                                handleInputChange(
                                                    "date",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {errors.date && (
                                            <InvalidFeedback
                                                errorMsg={errors.date}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="w-100"></div>

                                {/* supplier */}
                                <div className="col-lg-6">
                                    <div className="mb-3">
                                        <InputLabel label={"Customer"} />

                                        <SearchableSelect
                                            options={formatCustomerToOption}
                                            onSelect={handleCustomerChange}
                                            className={
                                                errors.customer && "is-invalid"
                                            }
                                            defaultValue={
                                                data.customer as string
                                            }
                                        />
                                        {errors.customer && (
                                            <InvalidFeedback
                                                errorMsg={errors.customer}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* supplier */}
                                <div className="col-lg-6">
                                    <div className="mb-3">
                                        <InputLabel label={"Invoices"} />
                                        <FormSelect
                                            value={data.sale}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLSelectElement>
                                            ) =>
                                                changeSale(
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className={
                                                errors.sale && "is-invalid"
                                            }
                                        >
                                            {sales.map((sale: ISaleType) => (
                                                <option
                                                    key={sale.id}
                                                    value={sale.id}
                                                >
                                                    {sale.invoice_id} - (
                                                    {system.currency.symbol}
                                                    {sale.amount})
                                                </option>
                                            ))}
                                        </FormSelect>
                                        {errors.sale && (
                                            <InvalidFeedback
                                                errorMsg={errors.sale}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <InputLabel label={"Paid amount"} />

                                        <div className="input-group">
                                            <div className="input-group-text">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    className="bi bi-cash"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                                                    <path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="number"
                                                step=".1"
                                                className={
                                                    errors.amount
                                                        ? "form-control is-invalid"
                                                        : "form-control"
                                                }
                                                value={data.amount}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) =>
                                                    changeAmount(
                                                        +e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        {errors.amount && (
                                            <InvalidFeedback
                                                errorMsg={errors.amount}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* payment mode input */}
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <InputLabel label={"Payment Mode"} />
                                        <FormSelect
                                            defaultValue={data.payment_mode}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLSelectElement>
                                            ) =>
                                                handleInputChange(
                                                    "payment_mode",
                                                    e.target.value
                                                )
                                            }
                                            className={
                                                errors.payment_mode &&
                                                "is-invalid"
                                            }
                                        >
                                            <option value="cash">Cash</option>
                                            <option value="online">
                                                Online
                                            </option>
                                            <option value="bank_transfer">
                                                Bank Transfer
                                            </option>
                                            <option value="upi">UPI</option>
                                            <option value="checks">
                                                Checks
                                            </option>
                                            <option value="other">Other</option>
                                        </FormSelect>
                                        {errors.payment_mode && (
                                            <InvalidFeedback
                                                errorMsg={errors.payment_mode}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="w-100"></div>

                                <div className="col-12">
                                    <div className="mb-3">
                                        <InputLabel label={"Transaction No."} />

                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={data.transaction_id}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) =>
                                                    setData(
                                                        "transaction_id",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter transaction number"
                                            />
                                        </div>
                                        {errors.transaction_id && (
                                            <InvalidFeedback
                                                errorMsg={errors.transaction_id}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="mb-3">
                                        <InputLabel label={"Note"} />
                                        <textarea
                                            className="form-control"
                                            value={data.note}
                                            onChange={(e) =>
                                                setData("note", e.target.value)
                                            }
                                        />
                                        {errors.note && (
                                            <InvalidFeedback
                                                errorMsg={errors.note}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 d-lg-block d-none">
                         
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
                            {processing ? "Create..." : "Create"}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </AuthLayout>
    );
};

export default Create;
