import React, { useState, useCallback } from 'react';
import { useForm } from '@inertiajs/react';

import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../../components/Modal';
import Button from '../../../components/Button';
import InputLabel from '../../../components/InputLabel';
import FormInput from '../../../components/FormInput';
import FormSelect from '../../../components/FormSelect';
import InvalidFeedback from '../../../components/InvalidFeedback';

const EditForm = ({ editedData }) => {

  console.log(editedData)
  
  const [showAddModel, setShowAddModel] = useState(false);
  const editModelToggler = useCallback(() => setShowAddModel(prevState => !prevState), []);

  const { data, setData, put, errors, processing } = useForm({
    name: editedData.name,
    email: editedData.email,
    phone: editedData.phone,
    address: editedData.address,
    city: editedData.city,
    state: editedData.state,
    country: editedData.country,
    postal_code: editedData.postal_code,
    is_active: editedData.is_active,
  });

  const handleEdit = useCallback(() => {
    put(route('warehouse.update', editedData.id), {
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

            {/* name */}
            <div className="mb-3">
              <InputLabel label={"Warehouse Name"} />
              <FormInput type="text" className="form-control" placeholder="Enter Warehouse Name"
                value={data.name} onChange={e => setData('name', e.target.value)}
              />
              {errors.name && <InvalidFeedback errorMsg={errors.name} />}
            </div>

            <div className="row">

              {/* email */}
              <div className="col-md-6">
                <div className="mb-3">
                  <InputLabel label={"Email"} />
                  <FormInput type="text" className="form-control" placeholder="example@email.com"
                    value={data.email} onChange={e => setData('email', e.target.value)}
                  />
                  {errors.email && <InvalidFeedback errorMsg={errors.email} />}
                </div>
              </div>
              {/* phone */}
              <div className="col-md-6">
                <div className="mb-3">
                  <InputLabel label={"Phone"} />
                  <FormInput type="text" className="form-control" placeholder="Enter phone number"
                    value={data.phone} onChange={e => setData('phone', e.target.value)}
                  />
                  {errors.phone && <InvalidFeedback errorMsg={errors.phone} />}
                </div>
              </div>

            </div>

            {/* address */}
            <div className="mb-3">
              <InputLabel label={"Address"} />
              <textarea type="text" className="form-control" placeholder="Enter Address"
                value={data.address} onChange={e => setData('address', e.target.value)}
              >
              </textarea>
              {errors.address && <InvalidFeedback errorMsg={errors.address} />}
            </div>

            <div className="row">
              {/* city */}
              <div className="col-md-6">
                <div className="mb-3">
                  <InputLabel label={"City"} />
                  <FormInput type="text" className="form-control" placeholder="Enter City"
                    value={data.city} onChange={e => setData('city', e.target.value)}
                  />
                  {errors.city && <InvalidFeedback errorMsg={errors.city} />}
                </div>
              </div>
              {/* state */}
              <div className="col-md-6">
                <div className="mb-3">
                  <InputLabel label={"State"} />
                  <FormInput type="text" className="form-control" placeholder="Enter State"
                    value={data.state} onChange={e => setData('state', e.target.value)}
                  />
                  {errors.state && <InvalidFeedback errorMsg={errors.state} />}
                </div>
              </div>

            </div>

            <div className="row">

              {/* postal code */}
              <div className="col-md-6">
                <div className="mb-3">
                  <InputLabel label={"Postal Code"} />
                  <FormInput type="text" className="form-control" placeholder="Enter Postal code"
                    value={data.postal_code} onChange={e => setData('postal_code', e.target.value)}
                  />
                  {errors.postal_code && <InvalidFeedback errorMsg={errors.postal_code} />}
                </div>
              </div>

              {/* country */}
              <div className="col-md-6">
                <div className="mb-3">
                  <InputLabel label={"Country"} />
                  <FormSelect
                    value={data.country}
                    onChange={(e) => setData('country', e.target.value)}
                  >
                    <option value="brazil">Brazil</option>
                    <option value="canada">Canada</option>
                    <option value="china">China</option>
                    <option value="france">France</option>
                    <option value="germany">Germany</option>
                    <option value="india">India</option>
                    <option value="japan">Japan</option>
                    <option value="south_africa">South Africa</option>
                    <option value="usa">USA</option>
                  </FormSelect>
                  {errors.country && <InvalidFeedback errorMsg={errors.country} />}
                </div>
              </div>

            </div>

            {/* status */}
            <div className="mb-3">
              <InputLabel label={"Is Active"} />
              <FormSelect
                value={data.is_active}
                onChange={(e) => setData('is_active', e.target.value)}
              >
                <option value="1">Active</option>
                <option value="0">InActive</option>

              </FormSelect>
              {errors.is_active && <InvalidFeedback errorMsg={errors.is_active} />}
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
