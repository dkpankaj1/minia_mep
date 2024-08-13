import React, { useState, useCallback } from "react";
import { useForm } from "@inertiajs/react";

import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/Modal";
import Button from "@/components/Button";
import InputLabel from "@/components/InputLabel";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import InvalidFeedback from "@/components/InvalidFeedback";
import { TCategoryType, TSubCategoryType } from "./Index";

interface IPropsType {
    editedData: TSubCategoryType;
    categories: Array<TCategoryType>;
}

const EditForm = ({ editedData, categories }: IPropsType) => {
    const [showAddModel, setShowAddModel] = useState(false);
    const editModelToggler = useCallback(
        () => setShowAddModel((prevState) => !prevState),
        []
    );

    const { data, setData, put, errors, processing } = useForm({
        name: editedData.name,
        category: editedData.category_id,
        description: editedData.description,
    });

    const handleEdit = useCallback(() => {
        put(route("sub-category.update", editedData.id), {
            onSuccess: () => {
                editModelToggler();
            },
        });
    }, [put, editedData.id, editModelToggler]);

    return (
        <>
            <Button
                className="btn btn-sm btn-soft-primary"
                onClick={editModelToggler}
            >
                <i className="bx bxs-edit font-size-16 align-middle"></i>
            </Button>
            {showAddModel && (
                <Modal toggler={editModelToggler} isOpen={showAddModel}>
                    <ModalHeader toggler={editModelToggler}>
                        <h5>Edit SubCategory</h5>
                    </ModalHeader>
                    <ModalBody>
                        <div className="mb-3">
                            <InputLabel label={"Category"} />
                            <FormSelect
                                value={data.category}
                                onChange={(
                                    e: React.ChangeEvent<HTMLSelectElement>
                                ) => setData("category", +e.target.value)}
                            >
                                {categories.map((category, index) => (
                                    <option key={index} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </FormSelect>
                            {errors.category && (
                                <InvalidFeedback errorMsg={errors.category} />
                            )}
                        </div>

                        <div className="mb-3">
                            <InputLabel label={"SubCategory Name"} />
                            <FormInput
                                type="text"
                                className="form-control"
                                placeholder="Enter SubCategory Name"
                                value={data.name}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => setData("name", e.target.value)}
                            />
                            {errors.name && (
                                <InvalidFeedback errorMsg={errors.name} />
                            )}
                        </div>

                        <div className="mb-3">
                            <InputLabel label={"Description"} />
                            <textarea
                                className="form-control"
                                placeholder="Enter Description"
                                value={data.description}
                                onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>
                                ) => setData("description", e.target.value)}
                            ></textarea>
                            {errors.description && (
                                <InvalidFeedback
                                    errorMsg={errors.description}
                                />
                            )}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleEdit}
                            disabled={processing}
                        >
                            {processing ? "Updating... " : "Update"}
                        </Button>
                        <Button
                            type="button"
                            className="btn btn-secondary"
                            onClick={editModelToggler}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            )}
        </>
    );
};

export default EditForm;
