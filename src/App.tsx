
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import CreateWorkspace from "./pages/CreateWorkspace";
import WorkspacePage from "./pages/WorkspacePage";
import WaitlistPage from "./pages/WaitlistPage";
import NotFound from "./pages/NotFound";
import { AppWrapper } from "@/components/AppWrapper";
import { TutorialProvider } from "@/contexts/TutorialContext";
import { TutorialOverlay } from "@/components/TutorialOverlay";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <TutorialProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppWrapper>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/create" element={<CreateWorkspace />} />
                <Route path="/waitlist" element={<WaitlistPage />} />
                <Route path="/workspace/:workspaceId" element={
                  <SidebarProvider>
                    <div className="min-h-screen flex w-full">
                      <AppSidebar />
                      <main className="flex-1">
                        <WorkspacePage />
                      </main>
                    </div>
                  </SidebarProvider>
                } />
                <Route path="/workspace/:workspaceId/branch/:branchId" element={
                  <SidebarProvider>
                    <div className="min-h-screen flex w-full">
                      <AppSidebar />
                      <main className="flex-1">
                        <WorkspacePage />
                      </main>
                    </div>
                  </SidebarProvider>
                } />
                <Route path="/index" element={
                  <SidebarProvider>
                    <div className="min-h-screen flex w-full">
                      <AppSidebar />
                      <main className="flex-1">
                        <Index />
                      </main>
                    </div>
                  </SidebarProvider>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppWrapper>
          </TooltipProvider>
        </BrowserRouter>
      </TutorialProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
