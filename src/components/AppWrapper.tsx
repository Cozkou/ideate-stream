import { TutorialOverlay } from './TutorialOverlay';

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  return (
    <div className="relative">
      {/* Tutorial overlay */}
      <TutorialOverlay />
      
      {/* Main app content */}
      {children}
    </div>
  );
}
