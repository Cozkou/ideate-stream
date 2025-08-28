import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ContextSidebar = () => {
  return (
    <aside className="w-80 h-screen bg-surface-elevated/80 backdrop-blur-sm border-l border-border/60 overflow-y-auto">
      <div className="p-6 space-y-8">
        {/* Context Section */}
        <div>
          <h3 className="font-semibold text-foreground mb-5 text-lg">Context</h3>
          <Card className="bg-background/60 border-border/60 rounded-xl overflow-hidden">
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-primary to-primary-glow rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-foreground leading-relaxed font-medium">
                  The target audience is young professionals
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-primary to-primary-glow rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-foreground leading-relaxed font-medium">
                  The app should be user-friendly and visually appealing
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Active Branches Section */}
        <div>
          <h3 className="font-semibold text-foreground mb-5 text-lg">Active Branches</h3>
          <div className="space-y-4">
            <Card className="bg-background/60 border-border/60 hover:border-border hover:bg-background/80 transition-all duration-200 cursor-pointer rounded-xl overflow-hidden">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-foreground">Branch 1</span>
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">3 ideas</Badge>
                </div>
                <p className="text-sm text-text-subtle leading-relaxed">
                  Campaigns such as focusing on achieving personal fitness goals
                </p>
              </div>
            </Card>
            
            <Card className="bg-background/60 border-border/60 hover:border-border hover:bg-background/80 transition-all duration-200 cursor-pointer rounded-xl overflow-hidden">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-foreground">Branch 2</span>
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">2 ideas</Badge>
                </div>
                <p className="text-sm text-text-subtle leading-relaxed">
                  Social media challenges and user-generated success stories
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div>
          <h3 className="font-semibold text-foreground mb-5 text-lg">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-background/40 rounded-xl border border-border/30">
              <div className="w-3 h-3 bg-avatar-2 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium">David branched fitness app ideas</p>
                <p className="text-xs text-text-subtle mt-1">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-background/40 rounded-xl border border-border/30">
              <div className="w-3 h-3 bg-avatar-3 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium">Emma added task management features</p>
                <p className="text-xs text-text-subtle mt-1">12 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-background/40 rounded-xl border border-border/30">
              <div className="w-3 h-3 bg-avatar-4 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium">John created language app tagline</p>
                <p className="text-xs text-text-subtle mt-1">18 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ContextSidebar;