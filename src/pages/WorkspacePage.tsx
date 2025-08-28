import CollaborativeHeader from "@/components/CollaborativeHeader";
import IdeationCard from "@/components/IdeationCard";
import ContextSidebar from "@/components/ContextSidebar";
import IdeationInput from "@/components/IdeationInput";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";

const WorkspacePage = () => {
  const { workspaceId } = useParams();
  
  const conversations = [
    {
      user: { name: "Sarah", avatar: "S", color: "avatar-1" },
      content: "Generate ideas for a new mobile app",
      type: "prompt" as const,
      responses: [
        "A fitness app with personalized workout plans",
        "A task management app designed for team meetings", 
        "A language learning app with real-time speech recognition"
      ]
    },
    {
      user: { name: "David", avatar: "D", color: "avatar-2" },
      content: "Give me marketing concepts for the fitness app",
      type: "prompt" as const,
    },
    {
      user: { name: "Emma", avatar: "E", color: "avatar-3" },
      content: "What are some potential features for the task management app?",
      type: "prompt" as const,
      responses: [
        "A customizable to-do list",
        "Built-in chat and collaboration tools",
        "Integration with calendars and file storage services"
      ]
    },
    {
      user: { name: "John", avatar: "J", color: "avatar-4" },
      content: "Write a tagline for the language learning app",
      type: "prompt" as const,
      responses: [
        "Speak like a local, effortlessly"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <CollaborativeHeader />
      
      <div className="flex h-[calc(100vh-80px)] overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Search and Navigation */}
          <div className="px-8 py-5 bg-surface-elevated border-b border-border/50">
            <div className="flex items-center gap-6 max-w-4xl">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-subtle w-5 h-5" />
                <Input 
                  placeholder="Search conversations and ideas..." 
                  className="pl-12 h-11 bg-background/80 border-border/60 hover:border-border transition-colors rounded-xl shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto px-8 py-8 space-y-8">
              {conversations.map((conversation, index) => (
                <IdeationCard
                  key={index}
                  user={conversation.user}
                  content={conversation.content}
                  responses={conversation.responses}
                  type={conversation.type}
                />
              ))}
              
              {/* Empty state when no conversations */}
              {conversations.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <Search className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Start Your Ideation Session</h3>
                  <p className="text-text-subtle max-w-md mx-auto">Begin by asking a question or sharing an idea. Our AI will help you explore and expand your thoughts.</p>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="px-8 py-6 bg-surface-elevated/80 backdrop-blur-sm border-t border-border/50">
            <div className="max-w-4xl mx-auto">
              <IdeationInput />
            </div>
          </div>
        </div>

        {/* Collapsible Right Sidebar */}
        <CollapsibleSidebar side="right">
          <ContextSidebar />
        </CollapsibleSidebar>
      </div>
    </div>
  );
};

export default WorkspacePage;