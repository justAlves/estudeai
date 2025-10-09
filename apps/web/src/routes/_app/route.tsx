import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { auth } from '@/lib/auth'
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'

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

  return (
    <>
      <Sidebar variant='floating' collapsible='icon'>
        <SidebarHeader>
          <SidebarTrigger/>
        </SidebarHeader>
          <SidebarContent>
            
          </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Outlet/>
      </SidebarInset>
      
    </>
  )
}
