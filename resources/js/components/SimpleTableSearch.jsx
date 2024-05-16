import React from 'react'
import FormInput from './FormInput'

function SimpleTableSearch() {
    return (
        <div className="row my-3 gap-1 justify-content-between">

            <div className="col-sm-12 col-md-5 col-lg-3">
                <div className="input-group">
                    <div className="input-group-text">Show</div>
                    <select className="form-select form-select-sm">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
            </div>

            <div className="col-sm-12 col-md-5 col-lg-3">
                <div className="input-group">
                    <FormInput type={"text"} className="form-control form-control-sm" />
                    <div className="input-group-text">Search</div>
                </div>
            </div>

        </div>
    )
}

export default SimpleTableSearch