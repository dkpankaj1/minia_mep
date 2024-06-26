import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/Modal';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import FormSelect from '../../components/FormSelect';
import InputLabel from '../../components/InputLabel';

const ModalEditCartItem = ({ showModel, toggleModal, selectedCartItem, setSelectedCartItem, handleUpdate, system }) => (

    <Modal toggler={toggleModal} isOpen={showModel}>
        <ModalHeader>
            <h5 className="modal-title">Edit Cart Item</h5>
            <Button type="button" className="btn-close" onClick={toggleModal}></Button>
        </ModalHeader>
        <ModalBody>
            <div className="row">
                <div className="row">

                    {selectedCartItem.is_batch == 1 && (
                        <div className="col-md-6">
                            <div className="mb-3">
                                <InputLabel label={"Batch"} />
                                <FormInput
                                    type="text"
                                    className="form-control"
                                    value={selectedCartItem.batch}
                                    onChange={(e) => setSelectedCartItem({ ...selectedCartItem, batch: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {selectedCartItem.is_batch == 1 && (
                        <div className="col-md-6">
                            <div className="mb-3">
                                <InputLabel label={"Expiration"} />
                                <FormInput
                                    type="date"
                                    className="form-control"
                                    value={selectedCartItem.expiration}
                                    onChange={(e) => setSelectedCartItem({ ...selectedCartItem, expiration: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    <div className="col-md-4">
                        <div className="mb-3">
                            <InputLabel label={`Cost (${system.currency.symbol})`} />
                            <FormInput
                                type="number"
                                className="form-control"
                                value={selectedCartItem.net_unit_cost}
                                onChange={(e) => setSelectedCartItem({ ...selectedCartItem, net_unit_cost: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="mb-3">
                            <InputLabel label={"Quantity"} />
                            <FormInput
                                type="number"
                                className="form-control"
                                value={selectedCartItem.quantity}
                                onChange={(e) => setSelectedCartItem({ ...selectedCartItem, quantity: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="mb-3">
                            <InputLabel label={"Purchase Unit"} />
                            <FormSelect
                                value={selectedCartItem.purchaseUnit}
                                onChange={(e) => setSelectedCartItem({ ...selectedCartItem, purchaseUnit: e.target.value })}
                            >
                                {selectedCartItem.availableUnit.map((unit, index) => (
                                    <option key={index} value={unit.id}>{unit.name}</option>
                                ))}
                            </FormSelect>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3">
                            <InputLabel label={"Discount Method"} />
                            <FormSelect
                                value={selectedCartItem.discountMethod}
                                onChange={(e) => setSelectedCartItem({ ...selectedCartItem, discountMethod: e.target.value })}
                            >
                                <option value="0">Fixed ({system.currency.symbol})</option>
                                <option value="1">Percent (%)</option>
                            </FormSelect>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3">
                            <InputLabel label={"Discount"} />
                            <FormInput
                                type="number"
                                className="form-control"
                                value={selectedCartItem.discount}
                                onChange={(e) => setSelectedCartItem({ ...selectedCartItem, discount: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3">
                            <InputLabel label={"Tax Method"} />
                            <FormSelect
                                value={selectedCartItem.taxMethod}
                                onChange={(e) => setSelectedCartItem({ ...selectedCartItem, taxMethod: e.target.value })}
                            >
                                <option value="0">inclusive</option>
                                <option value="1">exclusive</option>
                            </FormSelect>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3">
                            <InputLabel label={"Tax Rate (%)"} />
                            <FormInput
                                type="number"
                                className="form-control"
                                value={selectedCartItem.taxRate}
                                onChange={(e) => setSelectedCartItem({ ...selectedCartItem, taxRate: e.target.value })}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </ModalBody>
        <ModalFooter>
            <Button type="button" className="btn-secondary" onClick={toggleModal}>Cancel</Button>
            <Button type="button" className="btn-primary" onClick={handleUpdate}>Update</Button>
        </ModalFooter>
    </Modal>
);

export default React.memo(ModalEditCartItem);