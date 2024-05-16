import React from 'react'

function InvalidFeedback({ errorMsg, icon = <i className='fas fa-times '></i> }) {
    return (
        <div className="invalid-feedback d-block">
            {icon} &nbsp;{errorMsg}
        </div>
    )
}

export default InvalidFeedback