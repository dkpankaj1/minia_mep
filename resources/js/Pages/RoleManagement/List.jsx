import React from 'react'
import AuthLayout from '../../Layouts/AuthLayout'

function List({roles}) {
  return (
    <AuthLayout>
      <ul>
      {
        roles.map((role) => {
          return <li key={role.id}>{role.name}</li>
        })
      }
      </ul>
    </AuthLayout>
  )
}

export default List