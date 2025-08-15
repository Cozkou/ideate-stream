import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ContextSidebar = () => {
  return (
    <aside className="w-80 bg-surface-elevated border-l border-border p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-4">Context</h3>
        <Card className="p-4 bg-background border-border">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p className="text-sm text-foreground leading-relaxed">
                The target audience is young professionals
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p className="text-sm text-foreground leading-relaxed">
                The app should be user-friendly and visually appealing
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4">Active Branches</h3>
        <div className="space-y-3">
          <Card className="p-4 bg-background border-border hover:bg-surface-hover transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Branch 1</span>
              <Badge variant="secondary" className="text-xs">3 ideas</Badge>
            </div>
            <p className="text-sm text-text-subtle">
              Campaigns such as focusing on achieving personal fitness goals
            </p>
          </Card>
          
          <Card className="p-4 bg-background border-border hover:bg-surface-hover transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Branch 2</span>
              <Badge variant="secondary" className="text-xs">2 ideas</Badge>
            </div>
            <p className="text-sm text-text-subtle">
              Social media challenges and user-generated success stories
            </p>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-avatar-2 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-foreground">David branched fitness app ideas</p>
              <p className="text-xs text-text-subtle">5 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-avatar-3 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-foreground">Emma added task management features</p>
              <p className="text-xs text-text-subtle">12 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-avatar-4 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-foreground">John created language app tagline</p>
              <p className="text-xs text-text-subtle">18 minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ContextSidebar;