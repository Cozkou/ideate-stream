import { MessageSquare, GitBranch, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface IdeationCardProps {
  user: {
    name: string;
    avatar: string;
    color: string;
  };
  content: string;
  responses?: string[];
  timestamp?: string;
  type?: "prompt" | "response" | "branch";
}

const IdeationCard = ({ user, content, responses = [], timestamp = "2m", type = "prompt" }: IdeationCardProps) => {
  return (
    <div className="group relative">
      <Card className="bg-surface-elevated border-border p-6 hover:shadow-soft transition-all duration-300 hover:bg-surface-hover">
        <div className="flex items-start gap-4">
          <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
            <AvatarFallback className={`bg-${user.color} text-white font-medium`}>
              {user.avatar}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-medium text-foreground">{user.name}</span>
              <span className="text-sm text-text-subtle">{timestamp}</span>
              {type === "response" && (
                <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-medium">
                  AI
                </span>
              )}
            </div>
            
            <div className="text-foreground leading-relaxed mb-4">
              {content}
            </div>
            
            {responses.length > 0 && (
              <div className="space-y-3 ml-6 border-l-2 border-border pl-4">
                {responses.map((response, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground leading-relaxed">{response}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" className="text-text-subtle hover:text-foreground h-8 w-8 p-0">
              <MessageSquare className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-text-subtle hover:text-foreground h-8 w-8 p-0">
              <GitBranch className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-text-subtle hover:text-foreground h-8 w-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
          <Button variant="outline" size="sm" className="text-text-subtle hover:text-primary hover:border-primary">
            <MessageSquare className="w-4 h-4 mr-2" />
            Reply
          </Button>
          <Button variant="outline" size="sm" className="text-text-subtle hover:text-primary hover:border-primary">
            <GitBranch className="w-4 h-4 mr-2" />
            Branch
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default IdeationCard;