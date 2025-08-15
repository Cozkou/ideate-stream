import CollaborativeHeader from "@/components/CollaborativeHeader";
import IdeationCard from "@/components/IdeationCard";
import ContextSidebar from "@/components/ContextSidebar";
import IdeationInput from "@/components/IdeationInput";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Index = () => {
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
      
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Search and Navigation */}
          <div className="p-6 bg-surface-elevated border-b border-border">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-subtle w-4 h-4" />
                <Input 
                  placeholder="Search conversations..." 
                  className="pl-10 bg-background border-border"
                />
              </div>
            </div>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 p-6 space-y-6 overflow-auto">
            {conversations.map((conversation, index) => (
              <IdeationCard
                key={index}
                user={conversation.user}
                content={conversation.content}
                responses={conversation.responses}
                type={conversation.type}
              />
            ))}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-surface-elevated border-t border-border">
            <IdeationInput />
          </div>
        </div>

        {/* Sidebar */}
        <ContextSidebar />
      </div>
    </div>
  );
};

export default Index;
