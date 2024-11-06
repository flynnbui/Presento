import * as React from "react"
import {
  Home,
  LogOutIcon,
  Plus,
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
              <Button className="grid flex-1 text-left text-sm leading-tight" onClick={() => { navigate("/dashboard") }}>
                <div>
                  <span className="truncate font-semibold">Presto</span>
                </div>
              </Button>
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
