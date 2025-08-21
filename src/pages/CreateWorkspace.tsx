import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Sparkles, Users, DollarSign, MessageSquare, Bot, Search, Palette, Database, Globe, Check, Upload, Link, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTutorial } from "@/contexts/TutorialContext";
import { TutorialOverlay } from "@/components/TutorialOverlay";

const CreateWorkspace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { setSteps, startTutorial, nextStep, currentStep, isActive, setValidationCallback, skipTutorial, steps } = useTutorial();
  const [goal, setGoal] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [budget, setBudget] = useState("");
  const [tone, setTone] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [generatedAgents, setGeneratedAgents] = useState<any[]>([]);
  const [isGeneratingAgents, setIsGeneratingAgents] = useState(false);
  const [agentsGenerated, setAgentsGenerated] = useState(false);

  // Function to generate agents from LLM based on goal
  const generateAgentsFromGoal = async (goalText: string) => {
    if (!goalText.trim() || isGeneratingAgents) return;

    setIsGeneratingAgents(true);
    setAgentsGenerated(false);
    
    try {
      const response = await fetch('http://localhost:3001/api/agentize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: goalText.trim(),
          maxAgents: 6
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.team && data.team.agents) {
        // Transform LLM agents to match our UI format
        const transformedAgents = data.team.agents.map((agent: any, index: number) => ({
          id: agent.id || `llm-agent-${index}`,
          name: agent.role,
          icon: getIconForAgent(agent.role, index), // Helper function to assign icons
          description: agent.purpose || agent.callHint || "AI-generated agent",
          systemPrompt: agent.systemPrompt,
          responsibilities: agent.responsibilities,
          style: agent.style
        }));

        setGeneratedAgents(transformedAgents);
        setAgentsGenerated(true);
        
        toast({
          title: "Agents Generated!",
          description: `Generated ${transformedAgents.length} specialized agents for your goal.`,
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating agents:', error);
      toast({
        title: "Agent Generation Failed",
        description: "Failed to generate agents. Using default agents instead.",
        variant: "destructive",
      });
      
      // Fall back to default agents
      setGeneratedAgents(defaultAgents);
      setAgentsGenerated(true);
    } finally {
      setIsGeneratingAgents(false);
    }
  };

  // Helper function to assign icons to generated agents
  const getIconForAgent = (role: string, index: number) => {
    const roleLower = role.toLowerCase();
    
    if (roleLower.includes('research') || roleLower.includes('analyst')) return Search;
    if (roleLower.includes('design') || roleLower.includes('creative')) return Palette;
    if (roleLower.includes('critic') || roleLower.includes('feedback')) return MessageSquare;
    if (roleLower.includes('data') || roleLower.includes('database')) return Database;
    if (roleLower.includes('strategy') || roleLower.includes('planning')) return Bot;
    if (roleLower.includes('marketing') || roleLower.includes('audience')) return Users;
    if (roleLower.includes('finance') || roleLower.includes('budget')) return DollarSign;
    if (roleLower.includes('web') || roleLower.includes('scrape')) return Globe;
    
    // Default rotation of icons for other agents
    const icons = [Bot, Sparkles, Search, Palette, MessageSquare, Database];
    return icons[index % icons.length];
  };

  // Default agents fallback
  const defaultAgents = [
    { id: "researcher", name: "Researcher AI", icon: Search, description: "Market research and competitive analysis" },
    { id: "critic", name: "Critic AI", icon: MessageSquare, description: "Objective feedback and improvement suggestions" },
    { id: "designer", name: "Designer AI", icon: Palette, description: "Visual design and creative concepts" },
    { id: "data", name: "Data API", icon: Database, description: "Access to market data and analytics" },
    { id: "scraper", name: "Competitor Scraper", icon: Globe, description: "Automated competitor analysis" },
    { id: "strategist", name: "Strategy AI", icon: Bot, description: "Strategic planning and optimization" },
  ];

  // Set up validation callback
  useEffect(() => {
    const validateStep = (stepId: string) => {
      console.log('Validating step:', stepId, 'Goal length:', goal.trim().length, 'Agents generated:', agentsGenerated);
      if (stepId === 'goal-input') {
        // Step 1 requires goal to be filled
        const isValid = goal.trim().length > 0;
        console.log('Step 1 validation result:', isValid);
        return isValid;
      }
      if (stepId === 'context-section') {
        // Step 2 requires agents to be generated
        const isValid = agentsGenerated || !goal.trim();
        console.log('Step 2 validation result:', isValid);
        return isValid;
      }
      // Other steps don't require validation
      return true;
    };

    setValidationCallback(validateStep);
  }, [setValidationCallback, goal, agentsGenerated]);

  // Generate agents when goal changes and is not empty
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (goal.trim().length > 0) {
        // If goal changed significantly, regenerate agents
        if (!agentsGenerated || (agentsGenerated && !isGeneratingAgents)) {
          console.log('Generating agents for goal:', goal);
          // Reset selected agents when goal changes
          setSelectedAgents([]);
          generateAgentsFromGoal(goal);
        }
      } else {
        // Clear agents when goal is empty
        setGeneratedAgents([]);
        setAgentsGenerated(false);
        setSelectedAgents([]);
      }
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timeoutId);
  }, [goal]); // Only depend on goal to trigger regeneration on goal changes

  // Force tutorial to start immediately when component mounts
  useEffect(() => {
    // Set up tutorial steps and start immediately
    const tutorialSteps = [
      {
        id: 'goal-input',
        title: 'Define Your Goal',
        description: 'Start by entering a clear goal for your ideation session. Our AI will generate specialized agents based on your goal.',
        targetSelector: '[data-tutorial="header-and-goal-section"]',
        position: 'bottom' as const,
      },
      {
        id: 'context-section',
        title: 'Add Shared Context',
        description: 'While agents are being generated, provide additional context to help them give more relevant suggestions.',
        targetSelector: '[data-tutorial="context-section"]',
        position: 'bottom' as const,
      },
      {
        id: 'agent-selection',
        title: 'Choose Your AI Team',
        description: 'These specialized agents were generated for your goal. Select which ones will assist you in your ideation session.',
        targetSelector: '[data-tutorial="agent-section"]',
        position: 'top' as const,
      },
      {
        id: 'create-button',
        title: 'Create Your Workspace',
        description: 'Click "Create Workspace" to launch your collaborative ideation environment with your selected agents!',
        targetSelector: '[data-tutorial="action-buttons-section"]',
        position: 'top' as const,
      },
    ];

    console.log('Setting up tutorial steps...');
    
    // Ensure any previous tutorial state is cleaned up first
    if (isActive) {
      skipTutorial();
    }
    
    setSteps(tutorialSteps);
    
    // Start tutorial after component has fully mounted and rendered
    const startTutorialWhenReady = () => {
      const targetElement = document.querySelector('[data-tutorial="header-and-goal-section"]');
      if (targetElement) {
        console.log('Starting tutorial...');
        startTutorial();
      } else {
        // Retry if DOM elements not ready yet
        setTimeout(startTutorialWhenReady, 50);
      }
    };
    
    // Use requestAnimationFrame to ensure DOM is rendered, then start tutorial
    requestAnimationFrame(() => {
      setTimeout(startTutorialWhenReady, 20);
    });
  }, []); // Empty dependency array to run only once on mount
  
  // Additional effect to handle navigation state and ensure tutorial starts
  useEffect(() => {
    // Check if we navigated from landing page with intent to start tutorial
    const navigationState = location.state as any;
    if (navigationState?.fromLandingPage && navigationState?.startTutorial) {
      console.log('Navigated from landing page, ensuring tutorial starts...');
      // Give a bit more time for navigation transition to complete
      const ensureTutorialStarts = () => {
        if (steps.length > 0 && !isActive) {
          console.log('Starting tutorial after navigation from landing page');
          startTutorial();
        }
      };
      setTimeout(ensureTutorialStarts, 50);
    }
    
    // Check if we have tutorial steps set but tutorial is not active
    // This handles cases where navigation happens and tutorial needs to restart
    if (steps.length > 0 && !isActive && !currentStep) {
      console.log('Tutorial steps exist but not active, restarting...');
      const retryStart = () => {
        const targetElement = document.querySelector('[data-tutorial="header-and-goal-section"]');
        if (targetElement) {
          startTutorial();
        }
      };
      setTimeout(retryStart, 50);
    }
  }, [steps, isActive, currentStep, startTutorial, location.state]);

  // Remove automatic progression - let user control with Next button
  // useEffect(() => {
  //   if (currentStep === 'goal-input' && goal.length > 0) {
  //     const timer = setTimeout(() => {
  //       nextStep();
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [goal, currentStep, nextStep]);

  // Use generated agents or default agents as fallback
  const agents = generatedAgents.length > 0 ? generatedAgents : defaultAgents;

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
              placeholder="e.g., Brainstorm how to use Compt."
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
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-semibold text-foreground">
                Available Agents & Tools
              </h3>
              {isGeneratingAgents && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Generating agents...
                </div>
              )}
            </div>
            
            {isGeneratingAgents ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                {/* Loading skeleton for agents */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="p-3 border border-border bg-background">
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 mt-0.5 bg-muted animate-pulse rounded"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-muted animate-pulse rounded mb-2"></div>
                        <div className="h-2 bg-muted animate-pulse rounded w-3/4"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
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
            )}
            
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
      
      {/* Tutorial Overlay */}
      <TutorialOverlay />
    </div>
  );
};

export default CreateWorkspace;