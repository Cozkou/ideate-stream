import { useState, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollapsibleSidebarProps {
  children: ReactNode;
  side: "left" | "right";
  defaultCollapsed?: boolean;
  className?: string;
}

const CollapsibleSidebar = ({ 
  children, 
  side, 
  defaultCollapsed = false, 
  className = "" 
}: CollapsibleSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const ChevronIcon = side === "left" 
    ? (isCollapsed ? ChevronRight : ChevronLeft)
    : (isCollapsed ? ChevronLeft : ChevronRight);

  return (
    <div className={`relative flex ${side === "left" ? "flex-row" : "flex-row-reverse"} ${className}`}>
      <div 
        className={`transition-all duration-300 overflow-hidden ${
          isCollapsed ? "w-0" : "w-80"
        }`}
      >
        <div className="w-80">
          {children}
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className={`absolute top-4 z-10 h-8 w-8 p-0 bg-background border border-border hover:bg-surface-hover ${
          side === "left" 
            ? (isCollapsed ? "left-2" : "left-72") 
            : (isCollapsed ? "right-2" : "right-72")
        }`}
      >
        <ChevronIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CollapsibleSidebar;