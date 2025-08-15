
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTutorial } from '@/contexts/TutorialContext';
import { X, ArrowRight } from 'lucide-react';

export const TutorialOverlay: React.FC = () => {
  const { isActive, currentStep, steps, nextStep, skipTutorial } = useTutorial();
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const currentStepData = steps.find(step => step.id === currentStep);

  useEffect(() => {
    if (!isActive || !currentStepData) {
      setHighlightedElement(null);
      return;
    }

    const element = document.querySelector(currentStepData.targetSelector);
    if (element) {
      setHighlightedElement(element);
      
      // Calculate tooltip position
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      let top = rect.top + scrollTop;
      let left = rect.left + scrollLeft;
      
      // Adjust position based on preference
      switch (currentStepData.position) {
        case 'bottom':
          top += rect.height + 20;
          break;
        case 'top':
          top -= 20;
          break;
        case 'right':
          left += rect.width + 20;
          break;
        case 'left':
          left -= 20;
          break;
        default:
          top += rect.height + 20;
      }
      
      setTooltipPosition({ top, left });
      
      // Scroll element into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isActive, currentStep, currentStepData]);

  if (!isActive || !currentStepData) return null;

  return (
    <>
      {/* Full page overlay with blur effect */}
      <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm" />
      
      {/* Highlighted element cutout - clear visibility */}
      {highlightedElement && (
        <>
          {/* Clear spotlight for the highlighted element */}
          <div
            className="fixed z-[9999] pointer-events-none bg-transparent border-2 border-primary rounded-lg shadow-lg"
            style={{
              top: highlightedElement.getBoundingClientRect().top - 4,
              left: highlightedElement.getBoundingClientRect().left - 4,
              width: highlightedElement.getBoundingClientRect().width + 8,
              height: highlightedElement.getBoundingClientRect().height + 8,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.8), 0 0 20px rgba(59, 130, 246, 0.5)',
            }}
          />
        </>
      )}
      
      {/* Tutorial tooltip */}
      <Card 
        className="fixed z-[10000] max-w-sm p-4 bg-card border border-primary/20 shadow-xl backdrop-blur-sm"
        style={{
          top: tooltipPosition.top,
          left: Math.min(tooltipPosition.left, window.innerWidth - 384), // 384px = max-w-sm
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-foreground">{currentStepData.title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={skipTutorial}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {currentStepData.description}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Step {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}
          </span>
          
          <Button
            onClick={nextStep}
            size="sm"
            className="gap-1 bg-primary hover:bg-primary/90"
          >
            {steps.findIndex(s => s.id === currentStep) === steps.length - 1 ? 'Finish' : 'Next'}
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </Card>
    </>
  );
};
