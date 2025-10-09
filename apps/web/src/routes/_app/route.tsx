import { createFileRoute, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { auth } from '@/lib/auth'
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, useSidebar, SidebarFooter } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUserStore } from '@/store/user.store'
import { cn } from '@/lib/utils'
import { ChartColumnBigIcon, FileTextIcon, SettingsIcon, TestTube2Icon } from 'lucide-react'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const { user, setUser } = useUserStore()
  const { open } = useSidebar()
  const { pathname } = useLocation()

  const getAuth = async () => {
    const session = await auth.getSession()
    console.log(session)

    if(session.data === null){
      return navigate({
        to: '/login',
      })
    }

    setUser(session.data.user)
  }


  useEffect(() => {
    getAuth()
  }, [])

  return (
    <>
      <Sidebar variant='floating' collapsible='icon'>
        <SidebarHeader className='w-full'>
          <div className={cn('w-full p-3 rounded-lg flex items-center', !open && 'justify-center')}>
            <Avatar className={cn(!open && 'mx-auto')}>
              <AvatarImage
                src={user?.image ?? ''}
              />
              <AvatarFallback className='bg-gradient-to-r from-green-500 via-green-600 to-emerald-600'>
                {user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className={cn('ml-4', !open && 'hidden')}>
              <p className='text-white text-sm font-medium'>{user?.name}</p>
              <p className='text-neutral-400 text-sm font-medium'>{user?.email}</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className={cn('p-4 flex flex-col gap-2', !open && 'items-center')}>
          <SidebarMenu className={cn("space-y-4", !open && 'w-full pl-1')}>
            <SidebarMenuItem>
              <SidebarMenuButton 
                className={cn(
                  'w-full', 
                  !open && 'justify-center p-3', 
                  !open ? '' : 'p-4 py-5',
                  pathname === '/dashboard' && 'bg-green-500/10 text-emerald-600'
                )}
              >
                <ChartColumnBigIcon className={cn('size-4', !open && 'mx-auto')}/>
                <span className={cn(!open && 'hidden')}>Painel</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                className={cn(
                  'w-full', 
                  !open && 'justify-center p-3', 
                  !open ? '' : 'p-4 py-5',
                  pathname === '/simulados' && 'bg-green-500/10 text-emerald-600'
                )}
              >
                <TestTube2Icon className={cn('size-4', !open && 'mx-auto')}/>
                <span className={cn(!open && 'hidden')}>Simulados</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                className={cn(
                  'w-full', 
                  !open && 'justify-center p-3', 
                  !open ? '' : 'p-4 py-5',
                  pathname === '/redacoes' && 'bg-green-500/10 text-emerald-600'
                )}
              >
                <FileTextIcon className={cn('size-4', !open && 'mx-auto')}/>
                <span className={cn(!open && 'hidden')}>Redações</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuItem className='list-none'>
              <SidebarMenuButton 
                className={cn(
                  'w-full', 
                  !open && 'justify-center p-3', 
                  !open ? '' : 'p-4 py-5',
                  pathname === '/configuracoes' && 'bg-green-500/10 text-emerald-600'
                )}
              >
                <SettingsIcon className={cn('size-4', !open && 'mx-auto')}/>
                <span className={cn(!open && 'hidden')}>Configurações</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger className='pt-4'/>
        <Outlet/>
      </SidebarInset>
      
    </>
  )
}
