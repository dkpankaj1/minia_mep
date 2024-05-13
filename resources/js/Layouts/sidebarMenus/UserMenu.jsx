import React, { useState } from 'react'

function UserMenu() {

    const [open, setOpen] = useState(false)

    return (
        <li className={open ? "mm-active show" : ""} style={{ cursor: "pointer" }}>

            <a onClick={() => setOpen(!open)} className="has-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                <span data-key="t-apps">Apps</span>
            </a>
            <ul className={open ? "sub-menu mm-collapse mm-show" : "sub-menu mm-collapse"}>
                <li>
                    <a href="apps-calendar.html">
                        <span data-key="t-calendar">Calendar</span>
                    </a>
                </li>

                <li>
                    <a href="apps-chat.html">
                        <span data-key="t-chat">Chat</span>
                    </a>
                </li>
            </ul>
        </li>
    )
}

export default UserMenu