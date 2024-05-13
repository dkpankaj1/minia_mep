import React, { lazy, useState } from 'react'
import AuthLayout from '../../Layouts/AuthLayout'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/Modal'
const Button = lazy(() => import('../../components/Button'))

function Index() {

  const [openModel, setOpenModel] = useState(false)

  const toggler = () => setOpenModel(!openModel)

  return (
    <AuthLayout>

      <Button className='btn-primary' onClick={toggler}>Open Model</Button>

      <Modal toggler={toggler} isOpen={openModel}>

        <ModalHeader toggle={toggler}>
          <h5 className='modal-title'>Center modal</h5>
        </ModalHeader>

        <ModalBody>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Necessitatibus fuga optio laudantium officia ducimus aut modi repellat aspernatur a sapiente cum natus, autem, labore ratione. Natus minima maiores incidunt neque! Ab perferendis hic sit nam, nesciunt corporis explicabo? Obcaecati quaerat molestias dicta? Animi vitae cupiditate reiciendis, qui est iste at?</p>
        </ModalBody>

        <ModalFooter>
          <button type="button" className="btn btn-primary">Save changes</button>
          <button type="button" className="btn btn-secondary" onClick={toggler} >Close</button>
        </ModalFooter>

      </Modal>

    </AuthLayout>
  )
}

export default Index