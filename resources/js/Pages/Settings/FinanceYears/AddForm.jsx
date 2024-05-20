import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../../components/Modal'
import Button from '../../../components/Button'
import InputLabel from '../../../components/InputLabel'
import FormInput from '../../../components/FormInput'
import InvalidFeedback from '../../../components/InvalidFeedback'
import { useForm } from '@inertiajs/react'

function AddForm() {

  const [showAddModel, setShowAddModel] = useState(false)
  const addModelToggler = () => setShowAddModel(!showAddModel)

  const { data, setData, post, errors, reset, processing } = useForm({
    name: "",
    start_date: "",
    end_date: ""
  })

  const handleCreate = () => {
    post(route('finance-year.store'), {
      onSuccess: () => {
        reset(),
          addModelToggler()
      }
    })
  }

  return (
    <>
      <Button className="btn btn-light" onClick={addModelToggler}><i className="bx bx-plus me-1"></i> Add New</Button>

      <Modal toggler={addModelToggler} isOpen={showAddModel}>

        <ModalHeader toggle={addModelToggler}>
          <h5>Add New</h5>
        </ModalHeader>

        <ModalBody>
          <div className="mb-3">
            <InputLabel label={"Name"} />
            <FormInput type="text" className="form-control" placeholder="Enter Name"
              value={data.name} onChange={e => setData('name', e.target.value)}
            />
            {errors.name && <InvalidFeedback errorMsg={errors.name} />}
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <InputLabel label={"Start Date"} />
                <FormInput type="date" className="form-control" placeholder="Enter Name"
                  value={data.start_date} onChange={e => setData('start_date', e.target.value)}
                />
                {errors.start_date && <InvalidFeedback errorMsg={errors.start_date} />}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <InputLabel label={"End Date"} />
                <FormInput type="date" className="form-control" placeholder="Enter Name"
                  value={data.end_date} onChange={e => setData('end_date', e.target.value)}
                />
                {errors.end_date && <InvalidFeedback errorMsg={errors.end_date} />}
              </div>
            </div>
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

          <Button type="button" className="btn btn-secondary" onClick={addModelToggler} >Cancel</Button>
        </ModalFooter>

      </Modal>
    </>
  )
}

export default AddForm