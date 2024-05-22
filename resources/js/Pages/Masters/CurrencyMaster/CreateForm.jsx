import React, { useState, useCallback } from 'react';
import { useForm } from '@inertiajs/react';

import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../../components/Modal';
import Button from '../../../components/Button';
import InputLabel from '../../../components/InputLabel';
import FormInput from '../../../components/FormInput';
import InvalidFeedback from '../../../components/InvalidFeedback';

const CreateForm = () => {
  const [showAddModel, setShowAddModel] = useState(false);
  const addModelToggler = useCallback(() => setShowAddModel(prevState => !prevState), []);

  const { data, setData, post, errors, reset, processing } = useForm({
    name: "",
    short_name: "",
    symbol: "",
  });

  const handleCreate = useCallback(() => {
    post(route('currency.store'), {
      onSuccess: () => {
        reset();
        addModelToggler();
      }
    });
  }, [post, reset, addModelToggler]);

  return (
    <>
      <Button className="btn btn-light" onClick={addModelToggler}><i className="bx bx-plus me-1"></i> Add Currency</Button>

      {showAddModel && (
        <Modal toggler={addModelToggler} isOpen={showAddModel}>

          <ModalHeader toggle={addModelToggler}>
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