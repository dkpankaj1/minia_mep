import React, { useRef } from 'react';
import useClickOutside from '../hooks/useClickOutside';

export function Modal({ isOpen, toggler, children }) {
    
    const modalRef = useRef(null);
    useClickOutside(modalRef, toggler)
    
    {return isOpen && (
        <div className="modal fade bs-example-modal-center show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" ref={modalRef}>
                    {children}
                </div>
            </div>
        </div>
    )}
}

export function ModalHeader({ toggle, children }) {
    return (
        <div className="modal-header">
            {children}
            {toggle && <button type="button" className="btn-close" onClick={toggle}></button>}
        </div>
    );
}

export function ModalBody({ children }) {
    return <div className="modal-body">{children}</div>;
}

export function ModalFooter({ children }) {
    return <div className="modal-footer">{children}</div>;
}
