import { Search, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "./ThemeToggle";

const CollaborativeHeader = () => {
  const users = [
    { name: "Sarah", avatar: "S", color: "avatar-1" },
    { name: "David", avatar: "D", color: "avatar-2" },
    { name: "Emma", avatar: "E", color: "avatar-3" },
    { name: "John", avatar: "J", color: "avatar-4" },
  ];

  return (
    <header className="bg-surface-elevated border-b border-border px-6 py-4 flex items-center justify-between shadow-soft">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <h1 className="text-xl font-semibold text-foreground">
            Collaborative AI Ideation
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {users.map((user, index) => (
            <Avatar key={index} className="w-8 h-8 border-2 border-white shadow-sm">
              <AvatarFallback className={`bg-${user.color} text-white text-sm font-medium`}>
                {user.avatar}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="text-text-subtle hover:text-foreground">
            <Plus className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-text-subtle hover:text-foreground">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default CollaborativeHeader;