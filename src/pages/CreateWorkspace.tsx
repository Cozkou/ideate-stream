import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Sparkles, Users, DollarSign, MessageSquare, Bot, Search, Palette, Database, Globe, Check, Upload, Link, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTutorial } from "@/contexts/TutorialContext";

const CreateWorkspace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setSteps, startTutorial, nextStep, currentStep, isActive, setValidationCallback, skipTutorial } = useTutorial();
  const [goal, setGoal] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [budget, setBudget] = useState("");
  const [tone, setTone] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  useEffect(() => {
    // Set up tutorial steps only once
    setSteps([
      {
        id: 'goal-input',
        title: 'Define Your Goal',
        description: 'Start by entering a clear goal for your ideation session. This will help guide the AI assistants.',
        targetSelector: '[data-tutorial="header-and-goal-section"]',
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
        position: 'top',
      },
      {
        id: 'create-button',
        title: 'Create Your Workspace',
        description: 'Click the "Create Workspace" button below to complete the setup and start collaborating!',
        targetSelector: '[data-tutorial="action-buttons-section"]',
        position: 'top',
      },
    ]);
  }, [setSteps]);

  // Set up validation callback
  useEffect(() => {
    const validateStep = (stepId: string) => {
      console.log('Validating step:', stepId, 'Goal length:', goal.trim().length);
      if (stepId === 'goal-input') {
        // Step 1 requires goal to be filled
        const isValid = goal.trim().length > 0;
        console.log('Step 1 validation result:', isValid);
        return isValid;
      }
      // Other steps don't require validation
      return true;
    };

    setValidationCallback(validateStep);
  }, [setValidationCallback, goal]);

  // Separate effect to start tutorial immediately after steps are set
  useEffect(() => {
    // Auto-start tutorial immediately, but only if not already active
    if (!isActive) {
      startTutorial();
    }
  }, [startTutorial, isActive]);

  // Remove automatic progression - let user control with Next button
  // useEffect(() => {
  //   if (currentStep === 'goal-input' && goal.length > 0) {
  //     const timer = setTimeout(() => {
  //       nextStep();
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [goal, currentStep, nextStep]);

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

    // Complete tutorial if active
    if (isActive) {
      skipTutorial();
    }

    // Store workspace data for later use
    const workspaceData = {
      goal: goal.trim(),
      targetAudience: targetAudience.trim(),
      budget: budget.trim(),
      tone: tone.trim(),
      selectedAgents: selectedAgents,
      createdAt: new Date().toISOString()
    };

    // Store in localStorage to preserve data
    localStorage.setItem('currentWorkspace', JSON.stringify(workspaceData));

    // Generate workspace ID and navigate to main app
    const workspaceId = Math.random().toString(36).substring(2, 15);
    
    // Show success message
    toast({
      title: "Workspace created!",
      description: `Your workspace "${goal}" has been created successfully.`,
    });

    // Navigate to workspace with a small delay to show the toast
    setTimeout(() => {
      navigate(`/workspace/${workspaceId}`);
    }, 1000);
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
    <div className="min-h-screen bg-slate-900 p-2 sm:p-4 md:p-6 flex items-center justify-center overflow-hidden">
      <Card className="max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] p-3 sm:p-4 md:p-6 bg-surface-elevated border-border flex flex-col">
        <div className="flex-shrink-0" data-tutorial="header-and-goal-section">
          <div className="text-center mb-3 sm:mb-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1 sm:mb-2">Create a Workspace</h1>
            <p className="text-xs sm:text-sm text-text-subtle">Set up your collaborative ideation environment</p>
          </div>

          {/* Goal Section */}
          <div className="space-y-2 mb-4">
            <Label htmlFor="goal" className="text-foreground font-medium">
              Goal <span className="text-destructive">*</span>
            </Label>
            <Input
              id="goal"
              placeholder="e.g., Design a launch campaign for our new fitness app"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="bg-background text-foreground placeholder:text-text-subtle border-border"
            />

          </div>
        </div>

        <div className="flex-1 space-y-4">
          {/* Scrollable Content Area */}
          <div className="overflow-y-auto pr-2 scrollbar-hide space-y-4" style={{maxHeight: 'calc(90vh - 300px)'}}>
            {/* Shared Context */}
            <div className="space-y-3" data-tutorial="context-section">
              <h3 className="text-base font-semibold text-foreground">
                Shared Context
              </h3>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="context" className="text-foreground text-sm">Project Context & Resources</Label>
                  <Textarea
                    id="context"
                    placeholder="Describe your project context, upload files, add links, or share any relevant resources that will help guide the AI assistants..."
                    className="bg-background border-border text-sm min-h-[100px] resize-none"
                    rows={4}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Upload className="w-3 h-3 mr-1" />
                    Upload Files
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Link className="w-3 h-3 mr-1" />
                    Add Links
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <ImageIcon className="w-3 h-3 mr-1" />
                    Add Images
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Agent Selection - Non-scrollable */}
          <div className="space-y-2 sm:space-y-3 flex-shrink-0" data-tutorial="agent-section">
            <h3 className="text-sm sm:text-base font-semibold text-foreground">
              Available Agents & Tools
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
              {agents.map((agent) => {
                const Icon = agent.icon;
                const isSelected = selectedAgents.includes(agent.id);
                
                return (
                  <Card 
                    key={agent.id}
                    className={`p-3 cursor-pointer transition-all border ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-border bg-background hover:bg-surface-hover hover:border-primary/50'
                    }`}
                    onClick={() => handleAgentToggle(agent.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-primary' : 'text-text-subtle'}`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm">{agent.name}</h4>
                        <p className="text-xs text-text-subtle">{agent.description}</p>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
            
            <div className="min-h-[32px] p-2 bg-background/50 rounded-lg border border-border">
              <div className="text-xs text-muted-foreground mb-1">Selected Agents:</div>
              <div className="flex flex-wrap gap-1">
                {selectedAgents.length > 0 ? (
                  selectedAgents.map((agentId) => {
                    const agent = agents.find(a => a.id === agentId);
                    return (
                      <Badge key={agentId} variant="secondary" className="bg-primary/10 text-primary border border-primary/20 text-xs px-2 py-0.5">
                        {agent?.name}
                      </Badge>
                    );
                  })
                ) : (
                  <span className="text-xs text-muted-foreground italic">Click agents above to select them</span>
                )}
              </div>
            </div>
          </div>

        </div>
        
        {/* Action Buttons - Fixed at bottom */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 mt-4 border-t border-border flex-shrink-0" data-tutorial="action-buttons-section">
          <Button
            onClick={handleCreateWorkspace}
            className="flex-1"
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
      </Card>
      
      {/* Extra space for tutorial modal positioning */}
      <div className="h-64"></div>
    </div>
  );
};

export default CreateWorkspace;