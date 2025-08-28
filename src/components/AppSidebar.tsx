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
      case "active": return "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30";
      case "completed": return "bg-blue-500/20 text-blue-600 border border-blue-500/30";
      case "draft": return "bg-orange-500/20 text-orange-600 border border-orange-500/30";
      default: return "bg-gray-500/20 text-gray-600 border border-gray-500/30";
    }
  };

  const filteredWorkspaces = workspaces.filter(ws => 
    ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ws.goal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar className={collapsed ? "w-14" : "w-80"} collapsible="icon">
      <SidebarContent className="bg-sidebar-background flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border/60">
          {!collapsed && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-sm">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <h2 className="font-semibold text-sidebar-foreground text-lg">Workspaces</h2>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sidebar-foreground/60 w-4 h-4" />
                <Input
                  placeholder="Search workspaces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 bg-sidebar-accent/60 border-sidebar-border/60 hover:border-sidebar-border transition-colors rounded-lg text-sidebar-foreground placeholder:text-sidebar-foreground/50 text-sm"
                />
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="p-4">
          {!collapsed && (
            <div className="space-y-1">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground transition-all duration-200 text-sm ${
                    isActive 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-sidebar-accent/60"
                  }`
                }
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </NavLink>
              
              <NavLink 
                to="/create" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground transition-all duration-200 text-sm ${
                    isActive 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-sidebar-accent/60"
                  }`
                }
              >
                <Plus className="h-4 w-4" />
                <span>New Workspace</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Workspaces */}
        {!collapsed && (
          <div className="px-4 flex-1 overflow-auto">
            <div className="mb-3">
              <h3 className="text-sidebar-foreground/70 font-medium text-xs uppercase tracking-wider px-1">Your Workspaces</h3>
            </div>
            
            <div className="space-y-2">
              {filteredWorkspaces.length > 0 ? (
                filteredWorkspaces.map((workspace) => {
                  const isOpen = openWorkspaces.includes(workspace.id);
                  
                  return (
                    <div key={workspace.id} className="bg-sidebar-accent/40 rounded-lg border border-sidebar-border/40 overflow-hidden">
                      <Collapsible open={isOpen} onOpenChange={() => toggleWorkspace(workspace.id)}>
                        <CollapsibleTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start p-3 h-auto hover:bg-sidebar-accent/60 text-sidebar-foreground rounded-lg"
                          >
                            {isOpen ? (
                              <ChevronDown className="h-4 w-4 mr-2 text-sidebar-foreground/60" />
                            ) : (
                              <ChevronRight className="h-4 w-4 mr-2 text-sidebar-foreground/60" />
                            )}
                            <Folder className="h-4 w-4 mr-2 text-primary" />
                            <div className="flex-1 text-left">
                              <div className="font-medium text-sm text-sidebar-foreground">{workspace.name}</div>
                              <div className="text-xs text-sidebar-foreground/70 mt-0.5 line-clamp-2">{workspace.goal}</div>
                            </div>
                          </Button>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="bg-sidebar-accent/20 border-t border-sidebar-border/30">
                          <div className="p-2 space-y-1">
                            {workspace.branches.map((branch) => (
                              <NavLink
                                key={branch.id}
                                to={`/workspace/${workspace.id}/branch/${branch.id}`}
                                className={({ isActive }) => `
                                  flex items-center gap-2 p-2 rounded-md text-xs transition-all duration-200
                                  ${isActive 
                                    ? 'bg-primary/10 text-primary font-medium' 
                                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60'
                                  }
                                `}
                              >
                                <GitBranch className="h-3 w-3 flex-shrink-0" />
                                <span className="flex-1 font-medium">{branch.name}</span>
                                <Badge 
                                  className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${getStatusColor(branch.status)}`}
                                >
                                  {branch.status}
                                </Badge>
                              </NavLink>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6">
                  <div className="w-10 h-10 bg-sidebar-accent/60 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Folder className="w-5 h-5 text-sidebar-foreground/50" />
                  </div>
                  <p className="text-xs text-sidebar-foreground/60 mb-2">
                    {searchQuery ? "No workspaces found" : "No workspaces yet"}
                  </p>
                  <NavLink
                    to="/create"
                    className="text-xs text-primary hover:text-primary/80 font-medium"
                  >
                    Create your first workspace
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="mt-auto p-4 border-t border-sidebar-border/60">
          {!collapsed && (
            <NavLink 
              to="/settings" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground transition-all duration-200 text-sm ${
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "hover:bg-sidebar-accent/60"
                }`
              }
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </NavLink>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;