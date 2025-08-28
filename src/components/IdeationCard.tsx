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
      <Card className="bg-surface-elevated/60 backdrop-blur-sm border-border/60 hover:border-border hover:shadow-elegant transition-all duration-300 hover:bg-surface-elevated/80 rounded-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex items-start gap-5">
            <Avatar className="w-12 h-12 border-2 border-background shadow-elegant flex-shrink-0">
              <AvatarFallback className={`bg-${user.color} text-white font-semibold text-lg`}>
                {user.avatar}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-semibold text-foreground text-lg">{user.name}</span>
                <span className="text-sm text-text-subtle bg-background/50 px-3 py-1 rounded-full">{timestamp}</span>
                {type === "response" && (
                  <span className="text-xs bg-gradient-to-r from-primary to-primary-glow text-white px-3 py-1.5 rounded-full font-semibold shadow-soft">
                    AI Assistant
                  </span>
                )}
              </div>
              
              <div className="text-foreground leading-relaxed text-lg mb-6 font-medium">
                {content}
              </div>
              
              {responses.length > 0 && (
                <div className="bg-background/30 rounded-xl p-6 border border-border/40">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-primary to-primary-glow rounded-full"></div>
                    <span className="text-sm font-semibold text-foreground">AI Suggestions</span>
                  </div>
                  <div className="space-y-4">
                    {responses.map((response, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-background/60 rounded-xl border border-border/30 hover:border-border/60 transition-colors">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2.5 flex-shrink-0"></div>
                        <p className="text-foreground leading-relaxed font-medium">{response}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button variant="ghost" size="sm" className="text-text-subtle hover:text-foreground hover:bg-background/60 h-10 w-10 p-0 rounded-xl">
                <MessageSquare className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-text-subtle hover:text-foreground hover:bg-background/60 h-10 w-10 p-0 rounded-xl">
                <GitBranch className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-text-subtle hover:text-foreground hover:bg-background/60 h-10 w-10 p-0 rounded-xl">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border/40">
            <Button variant="outline" size="sm" className="text-text-subtle hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-200 rounded-xl px-4 py-2.5">
              <MessageSquare className="w-4 h-4 mr-2" />
              Reply
            </Button>
            <Button variant="outline" size="sm" className="text-text-subtle hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-200 rounded-xl px-4 py-2.5">
              <GitBranch className="w-4 h-4 mr-2" />
              Branch
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IdeationCard;