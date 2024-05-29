import React, { useState, useCallback } from 'react';
import { useForm } from '@inertiajs/react';

import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../../components/Modal';
import Button from '../../../components/Button';
import InputLabel from '../../../components/InputLabel';
import FormInput from '../../../components/FormInput';
import InvalidFeedback from '../../../components/InvalidFeedback';

const EditForm = ({ editedData, units }) => {

  const [showAddModel, setShowAddModel] = useState(false);
  const editModelToggler = useCallback(() => setShowAddModel(prevState => !prevState), []);

  const { data, setData, put, errors, reset, processing } = useForm({
    name: editedData.name,
    short_name: editedData.short_name,
    base_unit: editedData.base_unit?.id  || "",
    operator: editedData.operator,
    operator_value: editedData.operator_value,

  });

  const handleEdit = useCallback(() => {
    put(route('unit.update', editedData.id), {
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
            <h5>Edit Unit</h5>
          </ModalHeader>

          <ModalBody>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <InputLabel label={"Unit Name"} />
                  <FormInput type="text" className="form-control" placeholder="Enter Unit Name"
                    value={data.name} onChange={e => setData('name', e.target.value)}
                  />
                  {errors.name && <InvalidFeedback errorMsg={errors.name} />}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <InputLabel label={"Short Name"} />
                  <FormInput type="text" className="form-control" placeholder="Enter Short Name"
                    value={data.short_name} onChange={e => setData('short_name', e.target.value)}
                  />
                  {errors.short_name && <InvalidFeedback errorMsg={errors.short_name} />}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <InputLabel label={"Operator"} />
              <select className='form-select' value={data.operator} onChange={e => setData('operator', e.target.value)}>
                <option value="">--select--</option>
                <option value="*">multiplication (*)</option>
                <option value="/">division (/)</option>
              </select>
              {errors.operator && <InvalidFeedback errorMsg={errors.operator} />}
            </div>

            <div className="mb-3">
              <InputLabel label={"Operator Value"} />
              <FormInput type="text" className="form-control" placeholder="Enter operator value"
                value={data.operator_value} onChange={e => setData('operator_value', e.target.value)}
              />
              {errors.operator_value && <InvalidFeedback errorMsg={errors.operator_value} />}
            </div>

            <div className="mb-3">
              <InputLabel label={"Base Unit"} />
              <select className='form-select' defaultValue={data.base_unit} onChange={e => setData('base_unit', e.target.value)}>
                <option value="">--select--</option>
                {
                  units.map((unit, index) => <option key={unit.id} value={unit.id}>{unit.name}</option>)
                }
              </select>
              {errors.base_unit && <InvalidFeedback errorMsg={errors.base_unit} />}
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