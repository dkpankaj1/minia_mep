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
    calculate_rate: editedData.calculate_rate,
    description: editedData.description
  });

  const handleEdit = useCallback(() => {
    put(route('customer-group.update', editedData.id), {
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
            <h5>Edit Customer Group</h5>
          </ModalHeader>

          <ModalBody>

            <div className="mb-3">
              <InputLabel label={"Name"} />
              <FormInput type="text" className="form-control" placeholder="Enter name"
                value={data.name} onChange={e => setData('name', e.target.value)}
              />
              {errors.name && <InvalidFeedback errorMsg={errors.name} />}
            </div>

            <div className="mb-3">
              <InputLabel label={"Calculate Rate (%)"} />
              <FormInput type="number" className="form-control" step="0.1" min="-100" max="+100" placeholder="Enter calculate rate"
                value={data.calculate_rate} onChange={e => setData('calculate_rate', e.target.value)}
              />
              {errors.calculate_rate && <InvalidFeedback errorMsg={errors.calculate_rate} />}
            </div>

            <div className="mb-3">
              <InputLabel label={"Description"} />
              <textarea className="form-control" placeholder="Description"
                value={data.description} onChange={e => setData('description', e.target.value)}
              ></textarea>
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
