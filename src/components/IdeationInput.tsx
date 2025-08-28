import { useState } from "react";
import { Send, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const IdeationInput = () => {
  const [message, setMessage] = useState("");

  return (
    <Card className="bg-surface-elevated/80 backdrop-blur-md border-border/60 shadow-elegant rounded-2xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a question, share an idea, or request suggestions..."
              className="min-h-[100px] resize-none border-border/60 bg-background/60 focus:ring-primary focus:border-primary rounded-xl text-lg leading-relaxed placeholder:text-text-subtle/60"
            />
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              size="lg"
              disabled={!message.trim()}
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-elegant hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 rounded-xl h-12 w-12 p-0"
            >
              <Send className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 rounded-xl h-12 w-12 p-0"
            >
              <Sparkles className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/40">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-text-subtle hover:text-primary hover:bg-background/60 rounded-xl px-4 py-2">
              <Plus className="w-4 h-4 mr-2" />
              Add Context
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-subtle bg-background/50 px-3 py-1.5 rounded-full">
              Press ⌘ + Enter to send
            </span>
            <div className="text-xs text-text-subtle">
              {message.length}/2000
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default IdeationInput;