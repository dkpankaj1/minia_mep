import React, { useState } from 'react'

function PasswordInput({ ...rest }) {
    const [show, setShow] = useState(false)
    return (

        <div className="input-group auth-pass-inputgroup">
            <input type={show ? "text" : "password"}
                {...rest}
            />
            <button className="btn btn-light shadow-none ms-0" type="button" onClick={() => setShow(!show)}>
                <i className={show ? "mdi mdi-eye-off" : "mdi mdi-eye-outline"}></i>
            </button>
        </div>

    )
}

export default PasswordInput