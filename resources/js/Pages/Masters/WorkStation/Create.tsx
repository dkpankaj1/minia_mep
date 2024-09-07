import { Modal } from "@/components/Modal";
import { useForm } from "@inertiajs/react";
import WorkstationForm from "./WorkstationForm";

interface FormFieldType {
    name: string | "";
    description: string | "";
    status: number | "";
}

interface PropsType {
    isOpen: boolean;
    toggler: () => void;
}

function Create({ isOpen, toggler }: PropsType) {
    const { data, setData, processing, errors, clearErrors, reset, post } =
        useForm<FormFieldType>({
            name: "",
            description: "",
            status: "",
        });

    const inputFieldChange = (
        field: keyof FormFieldType,
        value: string | number
    ) => {
        clearErrors(field);
        setData(field, value);
    };

    const handleCreate = () =>
        post(route("workstation.store"), {
            onSuccess: () => {
                reset();
                toggler();
            },
        });

    return (
        <Modal isOpen={isOpen} toggler={toggler}>
            <Modal.Header toggler={toggler}>
                <h5>Add Workstation</h5>
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
                    onClick={toggler}
                >
                    Cancel
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default Create;
