import { AppSidebar } from "@/components/app-sidebar";
import { NewDialog } from "@/components/new-dialog";
import { PresentationCards } from "@/components/presentation-list";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import api from "@/config/axios";
import { Context } from "@/context";
import { Store, UserInfo } from "@/helpers/serverHelpers";
import { Home, LogOutIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";

const navMain = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
    isActive: true,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOutIcon,
  },
];

function Dashboard() {
  const { getters, setters } = useContext(Context);
  const [user, setUser] = useState<UserInfo>({
    name: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (getters.userData && getters.loginState) {
        setUser({
          name: getters.userData.user.name,
          email: getters.userData.user.email,
          avatar: "",
        });
      } else if (getters.loginState) {
        try {
          const storeResponse = await api.get("/store");
          const data: Store = storeResponse.data.store;
          setters.setUserData(data);
          setUser({
            name: data.user.name,
            email: data.user.email,
            avatar: "",
          });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };
    fetchUserData();
  }, [getters.userData, getters.loginState, setters]);

  const outerButton = <Button>New Presentation</Button>;
  return (
    <div className="dark">
      <SidebarProvider className="max-h-screen">
        <AppSidebar user={user} navMain={navMain} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 bg-zinc-300" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbPage className="hidden md:block">
                    Dashboard
                  </BreadcrumbPage>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div>
              <NewDialog Button={outerButton} />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-h-screen overflow-hidden">
            <div className="overflow-auto max-h-full h-full flex flex-col gap-4">
              <PresentationCards />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default Dashboard;
