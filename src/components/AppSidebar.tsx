import { useState } from "react";
import { Folder, GitBranch, Plus, Search, Home, Settings, ChevronDown, ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Workspace {
  id: string;
  name: string;
  goal: string;
  branches: Branch[];
}

interface Branch {
  id: string;
  name: string;
  status: "active" | "completed" | "draft";
}

const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [openWorkspaces, setOpenWorkspaces] = useState<string[]>(["ws1"]);

  const workspaces: Workspace[] = [
    {
      id: "ws1",
      name: "Fitness App Campaign",
      goal: "Design a launch campaign for our new fitness app",
      branches: [
        { id: "b1", name: "Marketing Strategy", status: "active" },
        { id: "b2", name: "Social Media Content", status: "draft" },
        { id: "b3", name: "Influencer Partnerships", status: "completed" },
      ]
    },
    {
      id: "ws2", 
      name: "Product Launch Q2",
      goal: "Launch strategy for new product line",
      branches: [
        { id: "b4", name: "Go-to-Market", status: "active" },
        { id: "b5", name: "Pricing Strategy", status: "draft" },
      ]
    }
  ];

  const toggleWorkspace = (workspaceId: string) => {
    setOpenWorkspaces(prev => 
      prev.includes(workspaceId)
        ? prev.filter(id => id !== workspaceId)
        : [...prev, workspaceId]
    );
  };

  const getStatusColor = (status: Branch["status"]) => {
    switch (status) {
      case "active": return "bg-primary text-primary-foreground";
      case "completed": return "bg-avatar-2 text-white";
      case "draft": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredWorkspaces = workspaces.filter(ws => 
    ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ws.goal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar className={collapsed ? "w-14" : "w-80"} collapsible="icon">
      <SidebarContent className="bg-sidebar-background">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          {!collapsed && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <h2 className="font-semibold text-sidebar-foreground">Workspaces</h2>
              </div>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sidebar-foreground/50 w-4 h-4" />
                <Input
                  placeholder="Search workspaces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50"
                />
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                      isActive ? "bg-sidebar-accent text-sidebar-primary font-medium" : "hover:bg-sidebar-accent/50"
                    }
                  >
                    <Home className="h-4 w-4" />
                    {!collapsed && <span>Home</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/create" 
                    className={({ isActive }) => 
                      isActive ? "bg-sidebar-accent text-sidebar-primary font-medium" : "hover:bg-sidebar-accent/50"
                    }
                  >
                    <Plus className="h-4 w-4" />
                    {!collapsed && <span>New Workspace</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Workspaces */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/70">Your Workspaces</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2">
                {filteredWorkspaces.map((workspace) => {
                  const isOpen = openWorkspaces.includes(workspace.id);
                  
                  return (
                    <Collapsible key={workspace.id} open={isOpen} onOpenChange={() => toggleWorkspace(workspace.id)}>
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start p-2 h-auto hover:bg-sidebar-accent text-sidebar-foreground"
                        >
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4 mr-2" />
                          ) : (
                            <ChevronRight className="h-4 w-4 mr-2" />
                          )}
                          <Folder className="h-4 w-4 mr-2" />
                          <div className="flex-1 text-left">
                            <div className="font-medium text-sm">{workspace.name}</div>
                            <div className="text-xs text-sidebar-foreground/60 truncate">{workspace.goal}</div>
                          </div>
                        </Button>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="ml-6 mt-1 space-y-1">
                        {workspace.branches.map((branch) => (
                          <NavLink
                            key={branch.id}
                            to={`/workspace/${workspace.id}/branch/${branch.id}`}
                            className={({ isActive }) => `
                              flex items-center gap-2 p-2 rounded text-sm transition-colors
                              ${isActive 
                                ? 'bg-sidebar-accent text-sidebar-primary font-medium' 
                                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50'
                              }
                            `}
                          >
                            <GitBranch className="h-3 w-3" />
                            <span className="flex-1">{branch.name}</span>
                            <Badge className={`text-xs px-1.5 py-0.5 ${getStatusColor(branch.status)}`}>
                              {branch.status}
                            </Badge>
                          </NavLink>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Settings */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink 
                  to="/settings" 
                  className={({ isActive }) => 
                    isActive ? "bg-sidebar-accent text-sidebar-primary font-medium" : "hover:bg-sidebar-accent/50"
                  }
                >
                  <Settings className="h-4 w-4" />
                  {!collapsed && <span>Settings</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;