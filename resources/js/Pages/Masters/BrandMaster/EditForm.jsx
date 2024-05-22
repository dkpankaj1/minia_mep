import React, { useState, useCallback } from 'react';
import { useForm } from '@inertiajs/react';

import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../../components/Modal';
import Button from '../../../components/Button';
import InputLabel from '../../../components/InputLabel';
import FormInput from '../../../components/FormInput';
import InvalidFeedback from '../../../components/InvalidFeedback';


const EditForm = ({ editedData }) => {
  const [showAddModel, setShowAddModel] = useState(false);
  const editModelToggler = useCallback(() => setShowAddModel(prevState => !prevState), []);

  const { data, setData, put, errors, processing } = useForm({
    name: editedData.name,
    description: editedData.description
  });

  const handleEdit = useCallback(() => {
    put(route('brand.update', editedData.id), {
      onSuccess: () => {
        editModelToggler();
      }
    });
  }, [put, editedData.id, editModelToggler]);

  return (
    <>
      <Button className="btn btn-sm btn-soft-primary" onClick={editModelToggler}>
        <i className="bx bxs-edit font-size-16 align-middle"></i>
      </Button>
      {showAddModel && (
        <Modal toggler={editModelToggler} isOpen={showAddModel}>
          <ModalHeader toggle={editModelToggler}>
            <h5>Edit Brand</h5>
          </ModalHeader>
          <ModalBody>
            <div className="mb-3">
              <InputLabel label={"Brand Name"} />
              <FormInput
                type="text"
                className="form-control"
                placeholder="Enter Brand Name"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
              />
              {errors.name && <InvalidFeedback errorMsg={errors.name} />}
            </div>
            <div className="mb-3">
              <InputLabel label={"Description"} />
              <textarea
                type="text"
                className="form-control"
                placeholder="Enter Description"
                value={data.description}
                onChange={e => setData('description', e.target.value)}
              />
              {errors.description && <InvalidFeedback errorMsg={errors.description} />}
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
            <Button type="button" className="btn btn-secondary" onClick={editModelToggler}>Cancel</Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
};

export default EditForm;
