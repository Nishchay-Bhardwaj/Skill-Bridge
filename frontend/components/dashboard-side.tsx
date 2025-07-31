"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, FileText, Home, Layers, PieChart, Settings, Upload, Users, Zap, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Resume Builder",
      icon: FileText,
      href: "/dashboard/resume-builder",
    },
    {
      title: "Resume Upload",
      icon: Upload,
      href: "/dashboard/resume-upload",
    },
    {
      title: "Resume Compare",
      icon: Layers,
      href: "/dashboard/resume-compare",
      isNew: true,
    },
    {
      title: "Skill Analysis",
      icon: PieChart,
      href: "/dashboard/skill-analysis",
    },
    {
      title: "Learning Paths",
      icon: Zap,
      href: "/dashboard/learning",
    },
    {
      title: "Skill Trends",
      icon: BarChart2,
      href: "/dashboard/trends",
    },
  ]

  return (
    <Sidebar variant="inset" className="border-r border-border/40">
      <SidebarHeader className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary">
            <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">SB</div>
          </div>
          <span className="text-xl font-bold">SkillBridge</span>
        </Link>
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className={cn("hidden md:flex", isMobileMenuOpen ? "flex" : "hidden")}>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Link href={item.href} className="flex items-center gap-2">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                  {item.isNew && (
                    <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-white">New</span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="hidden md:flex">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="/dashboard/settings" className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Help">
              <Link href="/dashboard/help" className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Help & Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
