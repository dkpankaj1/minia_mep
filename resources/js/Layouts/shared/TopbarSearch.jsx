import React from 'react'

function TopbarSearch() {
    return (
        <form className="app-search d-none d-lg-block">
            <div className="position-relative">
                <input type="text" className="form-control" placeholder="Search..." />
                <button className="btn btn-primary" type="button"><i className="bx bx-search-alt align-middle"></i></button>
            </div>
        </form>
    )
}

export default TopbarSearch