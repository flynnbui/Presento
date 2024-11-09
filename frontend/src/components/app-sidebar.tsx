import * as React from "react"
import {
  Home,
  LogOutIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupAction,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { NewDialog } from "./new-dialog"

const data = {
  user: {
    name: "Flynn",
    email: "flynn@example.com",
    avatar: "./assets/1.png",
  },
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: Home,
      isActive: true,
    },
    {
      title: "Logout",
      url: "/logout",
      icon: LogOutIcon,
    },
  ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <button className="grid flex-1 text-left text-sm leading-tight" onClick={() => { navigate("/dashboard") }}>
                <div>
                  <span className="truncate font-semibold">Presto</span>
                </div>
              </button>
            </SidebarMenuButton>
            <SidebarMenuButton size="lg" asChild>
              <NewDialog Button=
                {
                  <Button className="grid w-full text-left text-sm leading-tight">
                    <span className="truncate font-semibold">New Presentation</span>
                  </Button>
                } />
            </SidebarMenuButton>
            <SidebarGroupAction title="Add Presentation">
            </SidebarGroupAction>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
