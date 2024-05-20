import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../../components/Modal'
import Button from '../../../components/Button'
import InputLabel from '../../../components/InputLabel'
import FormInput from '../../../components/FormInput'
import InvalidFeedback from '../../../components/InvalidFeedback'
import { useForm } from '@inertiajs/react'

function EditForm({editedData}) {

  const [showEditModel, setShowEditModel] = useState(false)
  const editModelToggler = () => setShowEditModel(!showEditModel)

  const { data, setData, put, errors, reset, processing } = useForm({
    name: editedData.name,
    start_date: editedData.start_date,
    end_date: editedData.end_date
  })

  const handleEdit = () => {
    put(route('finance-year.update',editedData.id), {
      onSuccess: () => {
        reset(),
          editModelToggler()
      }
    })
  }

  return (
    <>
      <Button className="btn btn-sm btn-soft-primary" onClick={editModelToggler}>
        <i className="bx bxs-edit font-size-16 align-middle"></i>
      </Button>

      <Modal toggler={editModelToggler} isOpen={showEditModel}>

        <ModalHeader toggle={editModelToggler}>
          <h5>Edit</h5>
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
            onClick={handleEdit}
            disabled={processing}
          >
            {processing ? "Updating... " : "Update"}
          </Button>

          <Button type="button" className="btn btn-secondary" onClick={editModelToggler} >Cancel</Button>
        </ModalFooter>

      </Modal>
    </>
  )
}

export default EditForm