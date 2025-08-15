import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'input' | 'none';
  nextStep?: string;
}

interface TutorialContextType {
  isActive: boolean;
  currentStep: string | null;
  steps: TutorialStep[];
  startTutorial: () => void;
  nextStep: () => void;
  skipTutorial: () => void;
  setSteps: (steps: TutorialStep[]) => void;
  goToStep: (stepId: string) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};

interface TutorialProviderProps {
  children: ReactNode;
}

export const TutorialProvider: React.FC<TutorialProviderProps> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [steps, setSteps] = useState<TutorialStep[]>([]);

  const startTutorial = () => {
    if (steps.length > 0) {
      setIsActive(true);
      setCurrentStep(steps[0].id);
    }
  };

  const nextStep = () => {
    console.log('nextStep called, current:', currentStep);
    if (!currentStep) return;
    
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    console.log('Current index:', currentIndex, 'Total steps:', steps.length);
    
    if (currentIndex < steps.length - 1) {
      const nextStepId = steps[currentIndex + 1].id;
      console.log('Moving to next step:', nextStepId);
      setCurrentStep(nextStepId);
    } else {
      console.log('Tutorial completed, redirecting to waitlist');
      // Tutorial completed, redirect to waitlist
      setIsActive(false);
      setCurrentStep(null);
      window.location.href = '/waitlist';
    }
  };

  const skipTutorial = () => {
    setIsActive(false);
    setCurrentStep(null);
    window.location.href = '/waitlist';
  };

  const goToStep = (stepId: string) => {
    setCurrentStep(stepId);
  };

  return (
    <TutorialContext.Provider value={{
      isActive,
      currentStep,
      steps,
      startTutorial,
      nextStep,
      skipTutorial,
      setSteps,
      goToStep,
    }}>
      {children}
    </TutorialContext.Provider>
  );
};