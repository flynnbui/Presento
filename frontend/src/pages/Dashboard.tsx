import { AppSidebar } from "@/components/app-sidebar"
import { NewDialog } from "@/components/newdialog"
import  { PresentationCards } from "@/components/presentation-list"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import api from "@/config/axios"
import { Context, useContext } from "@/context"
import { Store } from "@/helpers/serverHelpers"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
//import { Outlet } from "react-router-dom"

function Dashboard() {
  const { getters, setters } = useContext(Context)
  const navigate = useNavigate()

  useEffect(() => {
    const setUserData = async () => {
      if (getters.loginState) {
        setters.setLogin(true)
        const data: Store = (await api.get('/store')).data.store
        setters.setUserData(data)
      }
    }
  
    setUserData()
    }, [getters.loginState, navigate])
  const outerButton = <Button>New Presentation</Button>;
  return (
    <div>
      <SidebarProvider className="max-h-screen">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 bg-zinc-300" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    Dashboard
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div>
              <NewDialog Button={outerButton} />
            </div>
          </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-h-screen overflow-hidden">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-zinc-800/50" />
          </div>
          <div className="overflow-auto max-h-full h-full flex flex-col gap-4">
            <PresentationCards />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </div>

  )
}


export default Dashboard