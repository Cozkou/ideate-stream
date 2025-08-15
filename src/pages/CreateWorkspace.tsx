import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Sparkles, Users, DollarSign, MessageSquare, Bot, Search, Palette, Database, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTutorial } from "@/contexts/TutorialContext";

const CreateWorkspace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setSteps, startTutorial, nextStep, currentStep } = useTutorial();
  const [goal, setGoal] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [budget, setBudget] = useState("");
  const [tone, setTone] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  useEffect(() => {
    // Set up tutorial steps
    setSteps([
      {
        id: 'goal-input',
        title: 'Define Your Goal',
        description: 'Start by entering a clear goal for your ideation session. This will help guide the AI assistants.',
        targetSelector: '#goal',
        position: 'bottom',
      },
      {
        id: 'context-section',
        title: 'Add Shared Context',
        description: 'Provide context like target audience, budget, and tone to help AI give more relevant suggestions.',
        targetSelector: '[data-tutorial="context-section"]',
        position: 'bottom',
      },
      {
        id: 'agent-selection',
        title: 'Choose AI Agents',
        description: 'Select which AI agents and tools will assist you. Each has different specialties.',
        targetSelector: '[data-tutorial="agent-section"]',
        position: 'bottom',
      },
      {
        id: 'create-button',
        title: 'Create Your Workspace',
        description: 'Click here to create your workspace and start collaborating!',
        targetSelector: '[data-tutorial="create-button"]',
        position: 'top',
      },
    ]);
    
    // Auto-start tutorial after a brief delay
    setTimeout(() => {
      startTutorial();
    }, 500);
  }, [setSteps, startTutorial]);

  // Handle tutorial progression based on user actions
  useEffect(() => {
    if (currentStep === 'goal-input' && goal.length > 0) {
      // Automatically move to next step when user has typed a goal
      const timer = setTimeout(() => {
        nextStep();
      }, 1000); // Small delay to show they've completed the step
      return () => clearTimeout(timer);
    }
  }, [goal, currentStep, nextStep]);

  const agents = [
    { id: "researcher", name: "Researcher AI", icon: Search, description: "Market research and competitive analysis" },
    { id: "critic", name: "Critic AI", icon: MessageSquare, description: "Objective feedback and improvement suggestions" },
    { id: "designer", name: "Designer AI", icon: Palette, description: "Visual design and creative concepts" },
    { id: "data", name: "Data API", icon: Database, description: "Access to market data and analytics" },
    { id: "scraper", name: "Competitor Scraper", icon: Globe, description: "Automated competitor analysis" },
    { id: "strategist", name: "Strategy AI", icon: Bot, description: "Strategic planning and optimization" },
  ];

  const handleAgentToggle = (agentId: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const handleCreateWorkspace = () => {
    if (!goal.trim()) {
      toast({
        title: "Goal required",
        description: "Please enter a goal for your workspace.",
        variant: "destructive",
      });
      return;
    }

    // Generate workspace ID and navigate to main app
    const workspaceId = Math.random().toString(36).substring(2, 15);
    navigate(`/workspace/${workspaceId}`);
  };

  const handleCopyLink = () => {
    if (!goal.trim()) {
      toast({
        title: "Create workspace first",
        description: "Please fill in the goal before copying the link.",
        variant: "destructive",
      });
      return;
    }

    const workspaceId = Math.random().toString(36).substring(2, 15);
    const link = `${window.location.origin}/workspace/${workspaceId}`;
    navigator.clipboard.writeText(link);
    
    toast({
      title: "Link copied!",
      description: "Workspace link has been copied to clipboard.",
    });
  };

  return (
    <div className="h-screen bg-background p-6 flex items-center justify-center overflow-hidden">
      <Card className="max-w-2xl w-full p-6 bg-surface-elevated border-border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Create Workspace</h1>
          <p className="text-text-subtle">Set up your collaborative ideation environment</p>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Goal Section */}
          <div className="space-y-2">
            <Label htmlFor="goal" className="text-foreground font-medium">
              Goal <span className="text-destructive">*</span>
            </Label>
            <Input
              id="goal"
              placeholder="e.g., Design a launch campaign for our new fitness app"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="bg-background border-border text-foreground placeholder:text-text-subtle"
            />
          </div>

          {/* Shared Context */}
          <div className="space-y-3" data-tutorial="context-section">
            <h3 className="text-base font-semibold text-foreground">
              Shared Context
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="audience" className="text-foreground">Target Audience</Label>
                <Input
                  id="audience"
                  placeholder="Young professionals"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-foreground">Budget Range</Label>
                <Input
                  id="budget"
                  placeholder="$10K - $50K"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tone" className="text-foreground">Tone & Style</Label>
                <Input
                  id="tone"
                  placeholder="Professional, friendly"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            </div>
          </div>

          {/* Available Agents */}
          <div className="space-y-3" data-tutorial="agent-section">
            <h3 className="text-base font-semibold text-foreground">
              Available Agents & Tools
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {agents.map((agent) => {
                const Icon = agent.icon;
                const isSelected = selectedAgents.includes(agent.id);
                
                return (
                  <Card 
                    key={agent.id}
                    className={`p-4 cursor-pointer transition-all border ${
                      isSelected 
                        ? 'border-primary bg-accent' 
                        : 'border-border bg-background hover:bg-surface-hover'
                    }`}
                    onClick={() => handleAgentToggle(agent.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 mt-0.5 ${isSelected ? 'text-primary' : 'text-text-subtle'}`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{agent.name}</h4>
                        <p className="text-sm text-text-subtle">{agent.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            
            {selectedAgents.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedAgents.map((agentId) => {
                  const agent = agents.find(a => a.id === agentId);
                  return (
                    <Badge key={agentId} variant="secondary" className="bg-primary/10 text-primary">
                      {agent?.name}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleCreateWorkspace}
              className="flex-1"
              data-tutorial="create-button"
            >
              Create Workspace
            </Button>
            
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="border-border hover:border-primary hover:text-primary"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateWorkspace;