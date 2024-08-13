import React, { useState, useCallback } from "react";
import { useForm } from "@inertiajs/react";

import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/Modal";
import Button from "@/components/Button";
import InputLabel from "@/components/InputLabel";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import InvalidFeedback from "@/components/InvalidFeedback";
import { TCategoryType } from "./Index";

interface IPropsType {
    categories: Array<TCategoryType>;
}

const CreateForm = ({ categories }: IPropsType) => {
    const [showAddModel, setShowAddModel] = useState(false);
    const addModelToggler = useCallback(
        () => setShowAddModel((prevState) => !prevState),
        []
    );

    const { data, setData, post, errors, reset, processing } = useForm({
        name: "",
        category: "",
        description: "",
    });

    const handleCreate = useCallback(() => {
        post(route("sub-category.store"), {
            onSuccess: () => {
                reset();
                addModelToggler();
            },
        });
    }, [post, reset, addModelToggler]);

    return (
        <>
            <Button className="btn btn-light" onClick={addModelToggler}>
                <i className="bx bx-plus me-1"></i> Add New
            </Button>

            {showAddModel && (
                <Modal toggler={addModelToggler} isOpen={showAddModel}>
                    <ModalHeader toggler={addModelToggler}>
                        <h5>Add SubCategory</h5>
                    </ModalHeader>

                    <ModalBody>
                        <div className="mb-3">
                            <InputLabel label={"Category"} />
                            <FormSelect
                                value={data.category}
                                onChange={(
                                    e: React.ChangeEvent<HTMLSelectElement>
                                ) => setData("category", e.target.value)}
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
                            onClick={handleCreate}
                            disabled={processing}
                        >
                            {processing ? "Creating... " : "Create"}
                        </Button>

                        <Button
                            type="button"
                            className="btn btn-secondary"
                            onClick={addModelToggler}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            )}
        </>
    );
};

export default CreateForm;
