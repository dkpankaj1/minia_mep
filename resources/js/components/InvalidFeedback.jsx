import React from 'react'

function InvalidFeedback({ errorMsg }) {
    return (
        <div className="invalid-feedback d-block">
            <i className='fas fa-times '></i> &nbsp;{errorMsg}
        </div>
    )
}

export default InvalidFeedback