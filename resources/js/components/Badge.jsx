import React from 'react'

function Badge({children,className="",...props}) {
  return (
    <span className={`badge ${className}`} {...props}>{children}</span>
  )
}

export default Badge