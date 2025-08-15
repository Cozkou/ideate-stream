import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

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
  previousStep: () => void;
  skipTutorial: () => void;
  setSteps: (steps: TutorialStep[]) => void;
  goToStep: (stepId: string) => void;
  setValidationCallback: (callback: (stepId: string) => boolean) => void;
  isCurrentStepValid: () => boolean;
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
  const [validationCallback, setValidationCallback] = useState<((stepId: string) => boolean) | null>(null);

  console.log('TutorialProvider render - isActive:', isActive, 'currentStep:', currentStep);

  useEffect(() => {
    console.log('Current step changed to:', currentStep);
  }, [currentStep]);

  const startTutorial = useCallback(() => {
    if (steps.length > 0) {
      setIsActive(true);
      setCurrentStep(steps[0].id);
    }
  }, [steps]);

  const nextStep = useCallback(() => {
    console.log('nextStep called, current:', currentStep, 'steps:', steps.map(s => s.id));
    if (!currentStep) return;
    
    // Validate current step before proceeding
    if (validationCallback && !validationCallback(currentStep)) {
      console.log('Validation failed for step:', currentStep);
      return;
    }
    
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    console.log('Current index:', currentIndex, 'Total steps:', steps.length);
    
    if (currentIndex < steps.length - 1) {
      const nextStepId = steps[currentIndex + 1].id;
      console.log('Moving to next step:', nextStepId);
      
      // Update the step first, then let the useEffect handle cleanup
      setCurrentStep(nextStepId);
      console.log('State updated to:', nextStepId);
    } else {
      console.log('Tutorial completed');
      // Tutorial completed - let the component handle what happens next
      setIsActive(false);
      setCurrentStep(null);
      
      // Clean up all highlights
      const allHighlighted = document.querySelectorAll('.tutorial-highlighted');
      allHighlighted.forEach(element => {
        element.classList.remove('tutorial-highlighted');
      });
    }
  }, [currentStep, steps, validationCallback]);

  const previousStep = useCallback(() => {
    console.log('previousStep called, current:', currentStep, 'steps:', steps.map(s => s.id));
    if (!currentStep) return;
    
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    console.log('Current index:', currentIndex);
    
    if (currentIndex > 0) {
      const prevStepId = steps[currentIndex - 1].id;
      console.log('Moving to previous step:', prevStepId);
      
      // Update the step first, then let the useEffect handle cleanup
      setCurrentStep(prevStepId);
      console.log('State updated to:', prevStepId);
    }
  }, [currentStep, steps]);

  const skipTutorial = useCallback(() => {
    // Clean up all highlighted elements before skipping
    const allHighlighted = document.querySelectorAll('.tutorial-highlighted');
    allHighlighted.forEach(element => {
      element.classList.remove('tutorial-highlighted');
    });
    
    setIsActive(false);
    setCurrentStep(null);
    // Don't automatically redirect - let the calling component handle navigation
  }, []);

  const goToStep = useCallback((stepId: string) => {
    setCurrentStep(stepId);
  }, []);

  const setValidationCallbackFn = useCallback((callback: (stepId: string) => boolean) => {
    setValidationCallback(() => callback);
  }, []);

  const isCurrentStepValid = useCallback(() => {
    if (!currentStep || !validationCallback) return true;
    return validationCallback(currentStep);
  }, [currentStep, validationCallback]);

  return (
    <TutorialContext.Provider value={{
      isActive,
      currentStep,
      steps,
      startTutorial,
      nextStep,
      previousStep,
      skipTutorial,
      setSteps,
      goToStep,
      setValidationCallback: setValidationCallbackFn,
      isCurrentStepValid,
    }}>
      {children}
    </TutorialContext.Provider>
  );
};