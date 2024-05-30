import React from 'react'
import AuthorizeLink from './AuthorizeLink'

function TableTopbar({ title, subTitle = "", url, count, ability }) {
    return (
        <div className="row align-items-center">
            <div className="col-6">
                <div className="mb-3">
                    <h5 className="card-title">{title}<span className="text-muted fw-normal ms-2">({count && count})</span></h5>
                    <p className='card-title-desc'>{subTitle}</p>
                </div>
            </div>

            <div className="col-6">
                <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                    <div>
                        <AuthorizeLink ability={ability} href={url} className="btn btn-light"><i className="bx bx-plus me-1"></i> Add New</AuthorizeLink>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default TableTopbar