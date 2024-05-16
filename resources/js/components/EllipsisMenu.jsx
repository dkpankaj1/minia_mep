import React, { useState, useEffect, useRef } from 'react'

function EllipsisMenu({children}) {
  const [show, setShow] = useState(false)
  const dropdownRef = useRef(null)

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShow(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <>
      <div className={show ? "show" : ""} role="group" style={{ position: "relative" }} ref={dropdownRef}>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setShow(!show)}>
          Action  <i className="mdi mdi-chevron-down d-none d-sm-inline-block"></i>
        </button>
        <div className={show ? "dropdown-menu show" : "dropdown-menu"} style={{ left: "-100px" }}>
          {/* <Link className="dropdown-item" href="#">title</Link> */}
          {children}
        </div>
      </div>
    </>
  )
}

export default EllipsisMenu