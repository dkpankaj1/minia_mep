import Button from '../../../components/Button'
import FormInput from '../../../components/FormInput'
import InputLabel from '../../../components/InputLabel'
import InvalidFeedback from '../../../components/InvalidFeedback'
import React, { useState } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from '../../../components/Modal'
import { useForm } from '@inertiajs/react'

function CreateForm() {

  const [showAddModel, setShowAddModel] = useState(false)
  const addModelToggler = () => setShowAddModel(!showAddModel)

  const { data, setData, post, errors, reset, processing } = useForm({
    name: "",
    calculate_rate: "",
    description: ""
  })

  const handleCreate = () => {
    post(route('customer-group.store'), {
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
          <h5>Add New Customer Group</h5>
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

export default CreateForm