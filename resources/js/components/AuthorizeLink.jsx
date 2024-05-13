import React from 'react'
import { Link } from '@inertiajs/react'
import { usePermission } from '../composable/Permission'

function AuthorizeLink({ ability, className = '', ...props }) {

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