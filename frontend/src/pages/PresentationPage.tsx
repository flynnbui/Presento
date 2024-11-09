import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import api from "@/config/axios";
import { Context } from "@/context";
import { Store } from "@/helpers/serverHelpers";
import { Code, FileType2, FileVideo, Home, Image, StickyNote } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


interface User {
  name: string;
  email: string;
  avatar: string;
}
const navMain = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
    isActive: true,
  },
  {
    title: "New Slide",
    url: "/logout",
    icon: StickyNote,
  },
  {
    title: "Insert text",
    url: "/",
    icon: FileType2
  },
  {
    title: "Insert Image",
    url: "/",
    icon: Image
  },
  {
    title: "Insert Video",
    url: "/",
    icon: FileVideo
  },
  {
    title: "Insert Code",
    url: "/",
    icon: Code
  },
];


export function PresentationPage() {
  const navigate = useNavigate()
  const { getters, setters } = useContext(Context)
  const [user, setUser] = useState<User>({ name: "", email: "", avatar: "" });



  useEffect(() => {
    const setUserData = async () => {
      if (getters.loginState) {
        setters.setLogin(true)
        const data: Store = (await api.get('/store')).data.store
        setters.setUserData(data)
      }
    }
    setUserData().then(() => {
      if (getters.userData) {
        setUser({ name: getters.userData.user.name, email: getters.userData.user.email, avatar: "" })
      }
    })
  }, [getters.loginState, getters.userData, navigate, setters])


  return (
    <div className="h-screen w-screen \ overflow-hidden">
      <SidebarProvider>
        <AppSidebar user={user} navMain={navMain} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 bg-zinc-300" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Presentation</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="w-full max-w-[calc(100vw-100px)] flex flex-nowrap overflow-x-auto space-x-4 h-[200px] scrollbar-hide">
              <div className="aspect-video max-w-[300px] rounded-xl bg-white" />
              <div className="aspect-video max-w-[300px] rounded-xl bg-white" />
              <div className="aspect-video max-w-[300px] rounded-xl bg-white" />
              <div className="aspect-video max-w-[300px] rounded-xl bg-white" />
              <div className="aspect-video max-w-[300px] rounded-xl bg-white" />
              <div className="aspect-video max-w-[300px] rounded-xl bg-white" />
              <div className="aspect-video max-w-[300px] rounded-xl bg-white" />
              <div className="aspect-video max-w-[300px] rounded-xl bg-white" />
              <div className="aspect-video max-w-[300px] rounded-xl bg-white" />
              <div className="aspect-video max-w-[300px] rounded-xl bg-white" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min bg-white" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
