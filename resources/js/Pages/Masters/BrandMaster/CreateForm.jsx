import React, { useState, useCallback } from 'react';
import { useForm } from '@inertiajs/react';

import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../../components/Modal';
import Button from '../../../components/Button';
import InputLabel from '../../../components/InputLabel';
import FormInput from '../../../components/FormInput';
import FormSelect from '../../../components/FormSelect';
import InvalidFeedback from '../../../components/InvalidFeedback';

const CreateForm = () => {
  const [showAddModel, setShowAddModel] = useState(false);
  const addModelToggler = useCallback(() => setShowAddModel(prevState => !prevState), []);

  const { data, setData, post, errors, reset, processing } = useForm({
    name: "",
    description: "",
    is_active : ""
  });

  const handleCreate = useCallback(() => {
    post(route('brand.store'), {
      onSuccess: () => {
        reset();
        addModelToggler();
      }
    });
  }, [post, reset, addModelToggler]);

  return (
    <>
      <Button className="btn btn-light" onClick={addModelToggler}><i className="bx bx-plus me-1"></i> Add New</Button>

      {showAddModel && (
        <Modal toggler={addModelToggler} isOpen={showAddModel}>

          <ModalHeader toggle={addModelToggler}>
            <h5>Add Brand</h5>
          </ModalHeader>

          <ModalBody>
            <div className="mb-3">
              <InputLabel label={"Brand Name"} />
              <FormInput type="text" className="form-control" placeholder="Enter Brand Name"
                value={data.name} onChange={e => setData('name', e.target.value)}
              />
              {errors.name && <InvalidFeedback errorMsg={errors.name} />}
            </div>

            <div className="mb-3">
              <InputLabel label={"Description"} />
              <textarea type="text" className="form-control" placeholder="Enter Description"
                value={data.description} onChange={e => setData('description', e.target.value)}
              >
              </textarea>
              {errors.description && <InvalidFeedback errorMsg={errors.description} />}
            </div>

            {/* status input */}
            <div className="mb-3">
                <InputLabel label={"Is Active"} />
                <FormSelect
                  defaultValue={data.is_active}
                  onChange={(e) => setData('is_active', e.target.value)}
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </FormSelect>
                {errors.is_active && <InvalidFeedback errorMsg={errors.is_active} />}
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

            <Button type="button" className="btn btn-secondary" onClick={addModelToggler}>Cancel</Button>
          </ModalFooter>

        </Modal>
      )}
    </>
  );
}

export default CreateForm;