import React, { useState } from "react";
import LimitFilter from "./Filters/LimitFilter";
import Offcanvas from "react-bootstrap/Offcanvas";

interface IQueryParam {
    [key: string]: string | number | "" | null | undefined;
}
interface IFilterProps {
    limitFilter?: React.ReactElement;
    children: React.ReactNode;
}

function Filter({ limitFilter, children }: IFilterProps) {
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <React.Fragment>
            <div className="row my-3 gap-1 justify-content-between align-content-baseline">
                <div className="col-sm-12 col-md-5 col-lg-3">
                    {limitFilter && limitFilter}
                </div>
                <div className="col-sm-12 col-md-5 col-lg-3 d-flex justify-content-end">
                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={handleShow}
                    >
                        <i className="bx bx-filter-alt me-2"></i> Filter
                    </button>
                </div>
            </div>

            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filter</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>{children}</Offcanvas.Body>
            </Offcanvas>
        </React.Fragment>
    );
}
export default Filter;
