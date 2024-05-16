import React from 'react'
import { Link } from '@inertiajs/react'
import { usePermission } from '../composable/usePermission'

function AuthorizeLink({ ability,children, ...props }) {

  const { hasPermission } = usePermission()

  return (
    <>
      {
        hasPermission(ability) && <Link  {...props}>
          {children}
        </Link>
      }
    </>
  )
}

export default AuthorizeLink