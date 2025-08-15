import { useState } from "react";
import { Send, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const IdeationInput = () => {
  const [message, setMessage] = useState("");

  return (
    <Card className="bg-surface-elevated border-border p-4 shadow-elegant">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message..."
            className="min-h-[80px] resize-none border-border bg-background focus:ring-primary"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-elegant transition-all duration-300"
          >
            <Send className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="hover:border-primary hover:text-primary">
            <Sparkles className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-4">
        <Button variant="ghost" size="sm" className="text-text-subtle hover:text-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Context
        </Button>
        <div className="flex-1"></div>
        <span className="text-xs text-text-subtle">
          Press ⌘ + Enter to send
        </span>
      </div>
    </Card>
  );
};

export default IdeationInput;