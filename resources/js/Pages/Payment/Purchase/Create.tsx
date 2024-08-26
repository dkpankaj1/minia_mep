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

interface ISupplierType {
    id: number;
    name: string;
    email: string;
    purchases: Array<IPurchaseType>;
}
interface IPurchaseType {
    id: number;
    reference: string;
    amount: number;
}
interface ISelectedPurchase {
    supplier_id: number | null;
    purchase_id: number | null;
    amount: number;
}
interface TFormDataField {
    date: string | "";
    supplier_id: number | "";
    purchase_id: number | "";
    amount: number | "";
    transaction_id: string | "";
    payment_mode: string | "";
    note: string | "";
}

interface IPagePropsType extends PageProp {
    system: TSystemPagePropType;
}

interface IPropsType {
    suppliers: Array<ISupplierType>;
    selectedPurchase: ISelectedPurchase;
}

const Create = ({ suppliers, selectedPurchase }: IPropsType) => {
    const { system } = usePage<IPagePropsType>().props;

    // Get the current date and format it to YYYY-MM-DD
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    const { data, setData, post, processing, errors, clearErrors } =
        useForm<TFormDataField>({
            date: formattedDate,
            supplier_id: selectedPurchase.supplier_id ?? "",
            purchase_id: selectedPurchase.purchase_id ?? "",
            amount: selectedPurchase.amount ?? 0,
            transaction_id: "",
            payment_mode: "",
            note: "",
        });

    const [purchases, setPurchases] = useState<Array<IPurchaseType>>([]);

    const formatSupplierToOption: any = suppliers.map((supplier) => {
        return {
            value: supplier.id,
            label: `${supplier.name} - ${supplier.email}`,
        };
    });

    const handleInputChange = (
        field: keyof TFormDataField,
        value: string |number | ""
    ) => {
        clearErrors(field);
        setData(field, value);
    };

    const handleSupplierChange = (supplier: any) => {
        clearErrors("supplier_id");
        if (!supplier) {
            setData({ ...data, supplier_id: "", purchase_id: "", amount: 0 });
            setPurchases([]);
        } else {
            const supplierId = supplier.value;
            setData({
                ...data,
                supplier_id: supplierId,
                purchase_id: "",
                amount: 0,
            });

            const selectedSupplier = suppliers.find(
                ({ id }) => id === supplierId
            );
            setPurchases(selectedSupplier?.purchases || []);
        }
    };

    const changePurchase = (purchaseId: number) => {
        clearErrors("purchase_id");

        const foundPurchase = purchases.find(
            (purchase) => purchase.id == purchaseId
        );
        const dueAmt = foundPurchase ? foundPurchase.amount : 0;

        setData({
            ...data,
            amount: dueAmt,
            purchase_id: purchaseId,
        });
    };

    const changeAmount = (amount: number) => {
        clearErrors("amount");

        const foundPurchase = purchases.find(
            (purchase) => purchase.id == data.purchase_id
        );
        const dueAmt = foundPurchase ? foundPurchase.amount : 0;
        const paidAmt = amount > dueAmt ? dueAmt : amount;

        setData({
            ...data,
            amount: paidAmt,
        });
    };

    const handleSubmit = () => {
        post(route("purchase.payment.store"));
    };

    useEffect(() => {
        const supplierPurchases = suppliers.find((supplier) => {
            return supplier.id == data.supplier_id;
        });
        if (supplierPurchases) {
            setPurchases(supplierPurchases.purchases);
        }
    }, [data.supplier_id]);

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
                                        <InputLabel label={"Supplier"} />

                                        <SearchableSelect
                                            options={formatSupplierToOption}
                                            onSelect={handleSupplierChange}
                                            className={
                                                errors.supplier_id &&
                                                "is-invalid"
                                            }
                                            defaultValue={
                                                data.supplier_id as string
                                            }
                                        />
                                        {errors.supplier_id && (
                                            <InvalidFeedback
                                                errorMsg={errors.supplier_id}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* supplier */}
                                <div className="col-lg-6">
                                    <div className="mb-3">
                                        <InputLabel label={"Purchases"} />
                                        <FormSelect
                                            value={data.purchase_id}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLSelectElement>
                                            ) =>
                                                changePurchase(
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className={
                                                errors.purchase_id &&
                                                "is-invalid"
                                            }
                                        >
                                            {purchases.map(
                                                (purchase: IPurchaseType) => (
                                                    <option
                                                        key={purchase.id}
                                                        value={purchase.id}
                                                    >
                                                        {purchase.reference} - (
                                                        {system.currency.symbol}
                                                        {purchase.amount})
                                                    </option>
                                                )
                                            )}
                                        </FormSelect>
                                        {errors.purchase_id && (
                                            <InvalidFeedback
                                                errorMsg={errors.purchase_id}
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
                            <div className="d-flex justify-content-center align-items-center w-100 h-100">
                                <svg
                                    fill="#0080ff"
                                    height="200px"
                                    width="200px"
                                    version="1.1"
                                    viewBox="0 0 511 511"
                                    stroke="#0080ff"
                                >
                                    <g
                                        id="SVGRepo_bgCarrier"
                                        strokeWidth="0"
                                    ></g>
                                    <g
                                        id="SVGRepo_tracerCarrier"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></g>
                                    <g id="SVGRepo_iconCarrier">
                                        {" "}
                                        <g>
                                            {" "}
                                            <path d="M47.5,343h40c4.142,0,7.5-3.358,7.5-7.5s-3.358-7.5-7.5-7.5h-40c-4.142,0-7.5,3.358-7.5,7.5S43.358,343,47.5,343z"></path>{" "}
                                            <path d="M151.5,360h-104c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5,7.5,7.5h104c4.142,0,7.5-3.358,7.5-7.5S155.642,360,151.5,360z"></path>{" "}
                                            <path d="M215.5,360h-40c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5,7.5,7.5h40c4.142,0,7.5-3.358,7.5-7.5S219.642,360,215.5,360z"></path>{" "}
                                            <path d="M151.5,328h-40c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5,7.5,7.5h40c4.142,0,7.5-3.358,7.5-7.5S155.642,328,151.5,328z"></path>{" "}
                                            <path d="M215.5,328h-40c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5,7.5,7.5h40c4.142,0,7.5-3.358,7.5-7.5S219.642,328,215.5,328z"></path>{" "}
                                            <path d="M279.5,328h-40c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5,7.5,7.5h40c4.142,0,7.5-3.358,7.5-7.5S283.642,328,279.5,328z"></path>{" "}
                                            <path d="M55.5,295h32c8.547,0,15.5-6.953,15.5-15.5v-24c0-8.547-6.953-15.5-15.5-15.5h-32c-8.547,0-15.5,6.953-15.5,15.5v24 C40,288.047,46.953,295,55.5,295z M88,255.5v24c0,0.275-0.224,0.5-0.5,0.5H79v-25h8.5C87.776,255,88,255.225,88,255.5z M55,255.5 c0-0.275,0.224-0.5,0.5-0.5H64v25h-8.5c-0.276,0-0.5-0.225-0.5-0.5V255.5z"></path>{" "}
                                            <path d="M267.5,240h-24c-15.164,0-27.5,12.336-27.5,27.5s12.336,27.5,27.5,27.5h24c15.164,0,27.5-12.336,27.5-27.5 S282.664,240,267.5,240z M267.5,280h-24c-6.893,0-12.5-5.607-12.5-12.5s5.607-12.5,12.5-12.5h24c6.893,0,12.5,5.607,12.5,12.5 S274.393,280,267.5,280z"></path>{" "}
                                            <path d="M463.5,232h-40c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5,7.5,7.5h40c4.142,0,7.5-3.358,7.5-7.5S467.642,232,463.5,232z"></path>{" "}
                                            <path d="M463.5,264h-104c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5,7.5,7.5h104c4.142,0,7.5-3.358,7.5-7.5S467.642,264,463.5,264z"></path>{" "}
                                            <path d="M359.5,247h40c4.142,0,7.5-3.358,7.5-7.5s-3.358-7.5-7.5-7.5h-40c-4.142,0-7.5,3.358-7.5,7.5S355.358,247,359.5,247z"></path>{" "}
                                            <path d="M511,135.498V127.5c0-17.369-14.131-31.5-31.5-31.5h-264c-17.369,0-31.5,14.131-31.5,31.5V192H31.5 C14.131,192,0,206.131,0,223.5v160C0,400.869,14.131,415,31.5,415h264c17.369,0,31.5-14.131,31.5-31.5V319h152.5 c17.369,0,31.5-14.131,31.5-31.5V135.502C511,135.501,511,135.499,511,135.498z M496,160h-6.394l6.394-6.394V160z M449.606,160 l17-17h18.787l-17,17H449.606z M409.606,160l17-17h18.787l-17,17H409.606z M369.606,160l17-17h18.787l-17,17H369.606z M329.606,160 l17-17h18.787l-17,17H329.606z M289.606,160l17-17h18.787l-17,17H289.606z M249.606,160l17-17h18.787l-17,17H249.606z M209.606,160 l17-17h18.787l-17,17H209.606z M199,143h6.394L199,149.394V143z M215.5,111h264c9.098,0,16.5,7.402,16.5,16.5v0.5H199v-0.5 C199,118.402,206.402,111,215.5,111z M312,383.5c0,9.098-7.402,16.5-16.5,16.5h-264c-9.098,0-16.5-7.402-16.5-16.5v-160 c0-9.098,7.402-16.5,16.5-16.5h192h72c9.098,0,16.5,7.402,16.5,16.5V383.5z M479.5,304H327v-25h8.5c4.142,0,7.5-3.358,7.5-7.5 s-3.358-7.5-7.5-7.5H327v-17h8.5c4.142,0,7.5-3.358,7.5-7.5s-3.358-7.5-7.5-7.5H327v-8.5c0-6.046-1.716-11.698-4.681-16.5H471.5 c4.142,0,7.5-3.358,7.5-7.5s-3.358-7.5-7.5-7.5h-176h-72H199v-17h297v112.5C496,296.598,488.598,304,479.5,304z"></path>{" "}
                                        </g>{" "}
                                    </g>
                                </svg>
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
                        >
                            {"Create"}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </AuthLayout>
    );
};

export default Create;
