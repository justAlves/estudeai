import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { auth } from '@/lib/auth'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const getAuth = async () => {
    const session = await auth.getSession()
    console.log(session)

    if(session.data === null){
      return navigate({
        to: '/login',
      })
    }
  }

  useEffect(() => {
    getAuth()
  }, [])

  return <Outlet/>
}
