import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CollaborativeHeader from "@/components/CollaborativeHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, Bot, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to create workspace if this is the first visit
  useEffect(() => {
    // Only redirect if we're on the exact root path and there's no workspace in the URL
    if (location.pathname === "/" && !location.search.includes("workspace")) {
      navigate("/create");
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <CollaborativeHeader />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome to Collaborative AI Ideation
            </h1>
            <p className="text-xl text-text-subtle max-w-2xl mx-auto">
              Create workspaces, collaborate with AI agents, and turn your ideas into reality through structured ideation sessions.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 bg-surface-elevated border-border hover:shadow-soft transition-all">
              <Users className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Team Collaboration</h3>
              <p className="text-text-subtle">Work together with your team and AI agents in real-time ideation sessions.</p>
            </Card>
            
            <Card className="p-6 bg-surface-elevated border-border hover:shadow-soft transition-all">
              <Bot className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">AI-Powered Insights</h3>
              <p className="text-subtle">Leverage specialized AI agents for research, design, strategy, and more.</p>
            </Card>
            
            <Card className="p-6 bg-surface-elevated border-border hover:shadow-soft transition-all">
              <Zap className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Structured Workflows</h3>
              <p className="text-text-subtle">Organize ideas into branches and track progress with clear goals and context.</p>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="p-8 bg-gradient-to-r from-accent to-accent/50 border-border inline-block">
              <h2 className="text-2xl font-bold text-foreground mb-4">Ready to start ideating?</h2>
              <p className="text-text-subtle mb-6">Create your first workspace and begin collaborating with AI.</p>
              <Button 
                onClick={() => navigate("/create")}
                className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-elegant transition-all"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Workspace
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
