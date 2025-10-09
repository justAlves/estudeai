import { auth } from '@/lib/auth'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const getAuth = async () => {
    const session = await auth.getSession()

    if(session.data !== null){
      return navigate({
        to: '/dashboard',
      })
    }
  }

  useEffect(() => {
    getAuth()
  }, [])

  return (
    <div className='max-h-screen h-screen flex flex-col'>
      <Outlet />
    </div>
  )
}
