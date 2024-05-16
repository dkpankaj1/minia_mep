import React, { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../components/Modal'
import Button from './Button'
import { usePermission } from '../composable/usePermission'

function ConfirmDelete({ ability, url, btnClass, btnLabel }) {

    const [openModel, setOpenModel] = useState(false)
    const toggler = () => setOpenModel(!openModel)
    const { delete: destroy, processing } = useForm()
    const { hasPermission } = usePermission()
    const handleDelete = () => {
        destroy(url, {
            onFinish: () => setOpenModel(false)
        })
    }

    return hasPermission(ability) && (
        <div>
            <Button className={btnClass} onClick={toggler}>{btnLabel}</Button>

            <Modal toggler={toggler} isOpen={openModel}>

                <ModalHeader toggle={toggler}>
                    <h5 className='modal-title'>Confirm Delete</h5>
                </ModalHeader>

                <ModalBody>
                    <p>Are you sure want to delete.</p>
                </ModalBody>

                <ModalFooter>
                    <Button
                        type="button"
                        className="btn btn-danger"
                        disabled={processing}
                        onClick={handleDelete}>
                        {processing ? "Delete.." : "Delete"}
                    </Button>
                    <Button type="button" className="btn btn-secondary" onClick={toggler} >Cancel</Button>
                </ModalFooter>

            </Modal>
        </div>
    )
}

export default ConfirmDelete