import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/Modal";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import InputLabel from "@/components/InputLabel";

interface IUnitType {
    id: number;
    name: string;
    operator: string;
    operator_value: number;
    short_name: string;
    base_unit: Array<IUnitType> | null;
}
interface ISelectedItemType {
    index: number;
    qnt: number;
    unit: IUnitType;
    available_unit: IUnitType[];
}

type TPropsType = {
    showModel: boolean;
    toggleModal: () => void;
    selectedItem: ISelectedItemType;
    setSelectedItem: React.Dispatch<React.SetStateAction<ISelectedItemType>>;
    handleUpdate: () => void;
};

function EditItem({
    showModel,
    toggleModal,
    selectedItem,
    setSelectedItem,
    handleUpdate,
}: TPropsType) {
    const handleSaleUnitChange = (value: number) => {
        const unit = selectedItem.available_unit.find(
            (unit) => unit.id === value
        );
        if (unit !== undefined && unit !== null) {
            setSelectedItem({
                ...selectedItem,
                unit: unit,
            });
        } else {
            console.log("error in changing sale unit");
        }
    };
    const handleQuantityChange = (value: number) => {
        const newValue = value;
        if (!isNaN(newValue)) {
            setSelectedItem({
                ...selectedItem,
                qnt: newValue,
            });
        }
    };
    return (
        <Modal toggler={toggleModal} isOpen={showModel}>
            <ModalHeader toggler={toggleModal}>
                <h5 className="modal-title">Edit Item</h5>
            </ModalHeader>
            <ModalBody>
                <div className="row">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <InputLabel label={"Quantity"} />
                                <FormInput
                                    step={0.1}
                                    type="number"
                                    className="form-control"
                                    value={selectedItem?.qnt}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => handleQuantityChange(+e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="mb-3">
                                <InputLabel label={"Sale Unit"} />
                                <FormSelect
                                    value={selectedItem?.unit?.id}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        handleSaleUnitChange(
                                            parseInt(e.target.value)
                                        )
                                    }
                                >
                                    {selectedItem?.available_unit?.map(
                                        (unit, index) => (
                                            <option key={index} value={unit.id}>
                                                {unit.name}
                                            </option>
                                        )
                                    )}
                                </FormSelect>
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
export default EditItem;
