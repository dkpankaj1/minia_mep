import InvalidFeedback from "@/components/InvalidFeedback";

interface FormFieldType {
    name: string;
    description: string;
    status: string | number;
}

interface PropsType {
    data: {
        name: string;
        description: string;
        status: number | string;
    };
    inputFieldChange: (
        name: keyof FormFieldType,
        value: string | number
    ) => void;
    errors: {
        name?: string;
        description?: string;
        status?: string;
    };
}

function WorkstationForm({ data, inputFieldChange, errors }: PropsType) {
    return (
        <>
            <div className="mb-3">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    placeholder="Enter Name"
                    className="form-control"
                    value={data.name}
                    onChange={(e) => inputFieldChange("name", e.target.value)}
                />
                {errors.name && <InvalidFeedback errorMsg={errors.name} />}
            </div>
            <div className="mb-3">
                <label htmlFor="name">Status</label>
                <select
                    className="form-select"
                    value={data.status}
                    onChange={(e) =>
                        inputFieldChange("status", +e.target.value)
                    }
                >
                    <option value={""}>--- select ---</option>
                    <option value={1}>Active</option>
                    <option value={0}>In-active</option>
                </select>
                {errors.status && <InvalidFeedback errorMsg={errors.status} />}
            </div>
            <div className="mb-3">
                <label htmlFor="name">Description</label>
                <textarea
                    className="form-control"
                    placeholder="description"
                    onChange={(e) =>
                        inputFieldChange("description", e.target.value)
                    }
                >
                    {data.description}
                </textarea>
                {errors.description && (
                    <InvalidFeedback errorMsg={errors.description} />
                )}
            </div>
        </>
    );
}

export default WorkstationForm;
