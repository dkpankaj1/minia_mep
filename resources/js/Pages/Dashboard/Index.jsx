import React, { lazy, useState } from 'react'
import AuthLayout from '../../Layouts/AuthLayout'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/Modal'
import { Tabs, TabItems, TabContent, TabPane } from '../../components/Tabs'
const Button = lazy(() => import('../../components/Button'))

function Index() {

  const [openModel, setOpenModel] = useState(false)

  const toggler = () => setOpenModel(!openModel)

  const [openTab, setOpenTab] = useState(1)

  const toggleTab = (index) => {
    setOpenTab(index)
  }


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
      <hr />
      <Tabs>
        <TabItems>
          <Button className='btn-primary' onClick={() => toggleTab(1)}>Tab 1</Button>
          <Button className='btn-primary' onClick={() => toggleTab(2)}>Tab 2</Button>
        </TabItems>
      </Tabs>

      <TabContent>
        <TabPane index={1} activeIndex={openTab}>
          <p>11111111Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab, repellendus?</p>
        </TabPane>
        <TabPane index={2} activeIndex={openTab}>
          <p>2222222222222222Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab, repellendus?</p>
        </TabPane>
      </TabContent>




    </AuthLayout>
  )
}

export default Index