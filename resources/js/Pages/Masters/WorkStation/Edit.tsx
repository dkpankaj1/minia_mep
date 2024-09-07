import { useState } from "react";
import { Modal } from "@/components/Modal";
import { useForm } from "@inertiajs/react";
import WorkstationForm from "./WorkstationForm";

interface FormFieldType {
    name: string | "";
    description: string | "";
    status: number | "";
}
interface WorkStationType {
    id: number;
    name: string;
    description: string;
    status: number;
}

interface PropsType {
    workstation: WorkStationType;
}

function Edit({ workstation }: PropsType) {
    const [showEditForm, setShowEditForm] = useState(false);
    const editFormToggler = () => setShowEditForm(!showEditForm);

    const { data, setData, processing, errors, clearErrors, reset, put } =
        useForm<FormFieldType>({
            name: workstation.name,
            description: workstation.description,
            status: workstation.status,
        });

    const inputFieldChange = (
        field: keyof FormFieldType,
        value: string | number
    ) => {
        clearErrors(field);
        setData(field, value);
    };

    const handleCreate = () =>
        put(route("workstation.update", workstation.id), {
            onSuccess: () => {
                editFormToggler();
            },
        });

    return (
        <>
            <button
                className="btn btn-sm btn-soft-primary"
                onClick={editFormToggler}
            >
                <i className="bx bxs-edit font-size-16 align-middle"></i>
            </button>

            <Modal isOpen={showEditForm} toggler={editFormToggler}>
                <Modal.Header toggler={editFormToggler}>
                    <h5>Edit Workstation</h5>
                </Modal.Header>
                <Modal.Body>
                    <WorkstationForm
                        data={data}
                        inputFieldChange={inputFieldChange}
                        errors={errors}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleCreate}
                        disabled={processing}
                    >
                        {processing ? "Creating... " : "Create"}
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={editFormToggler}
                    >
                        Cancel
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Edit;
