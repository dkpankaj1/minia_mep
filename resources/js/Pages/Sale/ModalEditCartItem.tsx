import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/Modal";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import InputLabel from "@/components/InputLabel";
import { ISelectedSaleItemType } from "./Create";

type TPropsType = {
    showModel: boolean;
    toggleModal: () => void;
    selectedCartItem: ISelectedSaleItemType;
    setSelectedCartItem: React.Dispatch<
        React.SetStateAction<ISelectedSaleItemType>
    >;
    handleUpdate: () => void;
    system: TSystemPagePropType;
};

function ModalEditCartItem({
    showModel,
    toggleModal,
    selectedCartItem,
    setSelectedCartItem,
    handleUpdate,
    system,
}: TPropsType) {
    const handleSaleUnitChange = (value: number) => {
        const saleUnit = selectedCartItem.available_units.find(
            (unit) => unit.id == value
        );
        if (saleUnit !== undefined && saleUnit !== null) {
            const convertedAvailability =
                (selectedCartItem.available /
                    selectedCartItem.sale_unit.operator_value) *
                saleUnit.operator_value;

            const convertedQuantity =
                (selectedCartItem.quantity /
                    selectedCartItem.sale_unit.operator_value) *
                saleUnit.operator_value;

            setSelectedCartItem({
                ...selectedCartItem,
                sale_unit: saleUnit,
                available: convertedAvailability,
                quantity: convertedQuantity,
            });
        } else {
            console.log("error in changing sale unit");
        }
    };

    const handleQuantityChange = (value: number) => {
        const newValue = value;
        if (!isNaN(newValue)) {
            setSelectedCartItem({
                ...selectedCartItem,
                quantity: Math.min(
                    Math.max(newValue, 1),
                    selectedCartItem.available
                ),
            });
        }
    };

    return (
        <Modal toggler={toggleModal} isOpen={showModel}>
            <ModalHeader toggler={toggleModal}>
                <h5 className="modal-title">Edit Cart Item</h5>
            </ModalHeader>
            <ModalBody>
                <div className="row">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <InputLabel label={"Quantity"} />
                                <FormInput
                                    type="number"
                                    className="form-control"
                                    value={selectedCartItem?.quantity}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        handleQuantityChange(
                                            parseInt(e.target.value)
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="mb-3">
                                <InputLabel label={"Sale Unit"} />
                                <FormSelect
                                    value={selectedCartItem.sale_unit.id}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        handleSaleUnitChange(
                                            parseInt(e.target.value)
                                        )
                                    }
                                >
                                    {selectedCartItem.available_units.map(
                                        (unit, index) => (
                                            <option key={index} value={unit.id}>
                                                {unit.name}
                                            </option>
                                        )
                                    )}
                                </FormSelect>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="mb-3">
                                <InputLabel label={"Discount Method"} />
                                <FormSelect
                                    value={selectedCartItem.discount_method}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setSelectedCartItem({
                                            ...selectedCartItem,
                                            discount_method: parseInt(
                                                e.target.value
                                            ),
                                        })
                                    }
                                >
                                    <option value="0">
                                        Fixed ({system.currency.symbol})
                                    </option>
                                    <option value="1">Percent (%)</option>
                                </FormSelect>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="mb-3">
                                <InputLabel label={"Discount"} />
                                <FormInput
                                    type="number"
                                    className="form-control"
                                    value={selectedCartItem.discount}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setSelectedCartItem({
                                            ...selectedCartItem,
                                            discount: parseInt(e.target.value),
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="mb-3">
                                <InputLabel label={"Tax Method"} />
                                <FormSelect
                                    value={selectedCartItem.tax_method}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setSelectedCartItem({
                                            ...selectedCartItem,
                                            tax_method: parseInt(
                                                e.target.value
                                            ),
                                        })
                                    }
                                >
                                    <option value="0">inclusive</option>
                                    <option value="1">exclusive</option>
                                </FormSelect>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="mb-3">
                                <InputLabel label={"Tax Rate (%)"} />
                                <FormInput
                                    type="number"
                                    className="form-control"
                                    value={selectedCartItem.tax_rate}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setSelectedCartItem({
                                            ...selectedCartItem,
                                            tax_rate: parseInt(e.target.value),
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button
                    type="button"
                    className="btn-secondary"
                    onClick={toggleModal}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    className="btn-primary"
                    onClick={handleUpdate}
                >
                    Update
                </Button>
            </ModalFooter>
        </Modal>
    );
}
export default React.memo(ModalEditCartItem);
