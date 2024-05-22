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

  const { data, setData, put, errors, reset, processing } = useForm({
    name: editedData.name,
    short_name: editedData.short_name,
    symbol: editedData.symbol,
  });

  const handleEdit = useCallback(() => {
    put(route('currency.update', editedData.id), {
      onSuccess: () => {
        editModelToggler();
      }
    });
  }, [put, reset, editModelToggler]);

  return (
    <>
      <Button className="btn btn-sm btn-soft-primary" onClick={editModelToggler}>
        <i className="bx bxs-edit font-size-16 align-middle"></i>
      </Button>

      {showAddModel && (
        <Modal toggler={editModelToggler} isOpen={showAddModel}>

          <ModalHeader toggle={editModelToggler}>
            <h5>Add Currency</h5>
          </ModalHeader>

          <ModalBody>

            <div className="mb-3">
              <InputLabel label={"Currency Name"} />
              <FormInput type="text" className="form-control" placeholder="Enter Currency Name"
                value={data.name} onChange={e => setData('name', e.target.value)}
              />
              {errors.name && <InvalidFeedback errorMsg={errors.name} />}
            </div>

            <div className="mb-3">
              <InputLabel label={"Short Name"} />
              <FormInput type="text" className="form-control" placeholder="Enter Short Name"
                value={data.short_name} onChange={e => setData('short_name', e.target.value)}
              />
              {errors.short_name && <InvalidFeedback errorMsg={errors.short_name} />}
            </div>

            <div className="mb-3">
              <InputLabel label={"Symbol"} />
              <FormInput type="text" className="form-control" placeholder="Enter Symbol"
                value={data.symbol} onChange={e => setData('symbol', e.target.value)}
              />
              {errors.symbol && <InvalidFeedback errorMsg={errors.symbol} />}
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
}

export default EditForm;
