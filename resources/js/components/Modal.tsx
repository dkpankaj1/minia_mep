import React, { useRef } from "react";
import useClickOutside from "../hooks/useClickOutside";

type TPropsType = {
    isOpen: boolean;
    toggler: () => void;
    children: React.ReactNode;
    className?: string;
};

export function Modal({
    isOpen,
    toggler,
    children,
    className = "modal-dialog-centered",
}: TPropsType) {
    const modalRef = useRef(null);
    useClickOutside(modalRef, toggler);

    {
        return (
            isOpen && (
                <div
                    className={`modal fade show`}
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                >
                    <div className={`modal-dialog ${className}`}>
                        <div className="modal-content" ref={modalRef}>
                            {children}
                        </div>
                    </div>
                </div>
            )
        );
    }
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export function ModalHeader({
    toggler,
    children,
}: {
    toggler: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="modal-header">
            {children}
            {toggler && (
                <button
                    type="button"
                    className="btn-close"
                    onClick={toggler}
                ></button>
            )}
        </div>
    );
}

export function ModalBody({ children }: { children: React.ReactNode }) {
    return <div className="modal-body">{children}</div>;
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
    return <div className="modal-footer">{children}</div>;
}
