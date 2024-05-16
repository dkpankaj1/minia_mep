import React from 'react'

function ValidFeedback({ errorMsg, icon = <i className=' fas fa-check '></i> }) {
    return (
        <div className="valid-feedback d-block">
            {icon}&nbsp;{errorMsg}
        </div>
    )
}

export default ValidFeedback