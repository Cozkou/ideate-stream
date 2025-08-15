
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTutorial } from '@/contexts/TutorialContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const TutorialOverlay: React.FC = () => {
  const { isActive, currentStep, steps, nextStep, previousStep, isCurrentStepValid } = useTutorial();
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const currentStepData = steps.find(step => step.id === currentStep);

  useEffect(() => {
    console.log('TutorialOverlay - Effect triggered - isActive:', isActive, 'currentStep:', currentStep);
    
    // Clear previous highlight and remove class from ALL previously highlighted elements
    const previouslyHighlighted = document.querySelectorAll('.tutorial-highlighted');
    previouslyHighlighted.forEach(element => {
      element.classList.remove('tutorial-highlighted');
    });
    
    if (highlightedElement) {
      highlightedElement.classList.remove('tutorial-highlighted');
    }
    setHighlightedElement(null);
    
    if (!isActive || !currentStepData) {
      console.log('Tutorial not active or no step data');
      return;
    }

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      const element = document.querySelector(currentStepData.targetSelector);
      console.log('Looking for element with selector:', currentStepData.targetSelector, 'Found:', !!element);
      
      if (element) {
        setHighlightedElement(element);
        
        // Add enhanced visibility to the highlighted element
        element.classList.add('tutorial-highlighted');
        
        // Calculate tooltip position using fixed positioning (no scroll offset needed)
        const rect = element.getBoundingClientRect();
        
        let top = rect.top;
        let left = rect.left;
        
        // Adjust position based on preference with proper spacing
        // Account for padding (16px) + border (24px) + extra clearance
        switch (currentStepData.position) {
          case 'bottom':
            top += rect.height + 40; // Clear the highlighted area completely
            break;
          case 'top':
            top -= 200; // Enough space above for tooltip without touching
            break;
          case 'right':
            left += rect.width + 40; // Clear the highlighted area completely  
            break;
          case 'left':
            left -= 60; // Clear the highlighted area completely
            break;
          default:
            top += rect.height + 40; // Default with proper spacing
        }
        
        // Ensure tooltip doesn't go off-screen
        const finalTop = Math.max(20, top); // At least 20px from top of screen
        const finalLeft = Math.max(20, Math.min(left, window.innerWidth - 384 - 20)); // Keep within bounds
        
        setTooltipPosition({ top: finalTop, left: finalLeft });
        
        // Scroll element into view
        // Only scroll into view if not on landing page (where tutorial is locked in position)
        if (window.location.pathname !== '/') {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Add scroll listener to update positions if needed
        const updatePosition = () => {
          const newRect = element.getBoundingClientRect();
          let newTop = newRect.top;
          let newLeft = newRect.left;
          
          switch (currentStepData.position) {
            case 'bottom':
              newTop += newRect.height + 40; // Match the main positioning logic
              break;
            case 'top':
              newTop -= 200; // Match the main positioning logic
              break;
            case 'right':
              newLeft += newRect.width + 40; // Match the main positioning logic
              break;
            case 'left':
              newLeft -= 60; // Match the main positioning logic
              break;
            default:
              newTop += newRect.height + 40; // Match the main positioning logic
          }
          
          // Ensure tooltip doesn't go off-screen
          const finalTop = Math.max(20, newTop);
          const finalLeft = Math.max(20, Math.min(newLeft, window.innerWidth - 384 - 20));
          
          setTooltipPosition({ top: finalTop, left: finalLeft });
        };
        
        // Update position on scroll
        const scrollContainer = document.querySelector('.scrollbar-hide');
        if (scrollContainer) {
          scrollContainer.addEventListener('scroll', updatePosition);
        }
        
        // Also listen to window scroll for landing page animations
        window.addEventListener('scroll', updatePosition);
        window.addEventListener('resize', updatePosition);
        
        return () => {
          if (scrollContainer) {
            scrollContainer.removeEventListener('scroll', updatePosition);
          }
          window.removeEventListener('scroll', updatePosition);
          window.removeEventListener('resize', updatePosition);
        };
      } else {
        console.log('Element not found for selector:', currentStepData.targetSelector);
      }
    }, 100);
  }, [isActive, currentStep, currentStepData]);

  // Cleanup effect when component unmounts or tutorial ends
  useEffect(() => {
    return () => {
      // Clean up all highlighted elements when component unmounts
      const allHighlighted = document.querySelectorAll('.tutorial-highlighted');
      allHighlighted.forEach(element => {
        element.classList.remove('tutorial-highlighted');
      });
    };
  }, []);

  if (!isActive || !currentStepData) {
    // Clean up when tutorial is not active
    const allHighlighted = document.querySelectorAll('.tutorial-highlighted');
    allHighlighted.forEach(element => {
      element.classList.remove('tutorial-highlighted');
    });
    return null;
  }

  return (
    <>
             {/* Blur overlay - everything except tutorial content */}
       {window.location.pathname === '/' ? (
         // On landing page: blur everything except the tutorial content area
         <div 
           className="fixed z-[9998] pointer-events-none backdrop-blur-md bg-black/50" 
           style={{ 
             top: 0,
             left: 0,
             right: 0,
             bottom: 0,
             opacity: 1,
             visibility: 'visible'
           }}
         />
       ) : window.location.pathname !== '/' ? (
         // On other pages: full screen blur
         <div 
           className="fixed inset-0 z-[9998] pointer-events-none backdrop-blur-[2px] bg-black/30" 
         />
       ) : null}
      
      {/* Clear cutout for highlighted element with pointer events enabled */}
      {highlightedElement && (
        <>
          {/* Clear background for highlighted element with extra space for padding */}
          <div
            className="fixed z-[9999] pointer-events-none"
            style={{
              top: highlightedElement.getBoundingClientRect().top - 20,
              left: highlightedElement.getBoundingClientRect().left - 20,
              width: highlightedElement.getBoundingClientRect().width + 40,
              height: highlightedElement.getBoundingClientRect().height + 40,
              backgroundColor: 'hsl(var(--background))',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          />
          
          {/* Clear background for highlighted element with extra space for padding */}
          <div
            className="fixed z-[9998] pointer-events-none"
            style={{
              top: highlightedElement.getBoundingClientRect().top - 20,
              left: highlightedElement.getBoundingClientRect().left - 20,
              width: highlightedElement.getBoundingClientRect().width + 40,
              height: highlightedElement.getBoundingClientRect().height + 40,
              backgroundColor: 'hsl(var(--background))',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          />
          
          {/* Highlight border around the element */}
          <div
            className="fixed z-[9999] pointer-events-none"
            style={{
              top: highlightedElement.getBoundingClientRect().top - 24,
              left: highlightedElement.getBoundingClientRect().left - 24,
              width: highlightedElement.getBoundingClientRect().width + 48,
              height: highlightedElement.getBoundingClientRect().height + 48,
              border: '2px solid hsl(var(--primary))',
              borderRadius: '12px',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
              background: 'transparent',
            }}
          />
        </>
      )}
      
      {/* Tutorial tooltip - always visible and clear */}
      <div
        className="fixed z-[10003] pointer-events-auto"
        style={{
          top: tooltipPosition.top,
          left: Math.min(tooltipPosition.left, window.innerWidth - 384), // 384px = max-w-sm
          opacity: window.location.pathname === '/' && !sessionStorage.getItem('tutorialVisible') ? 0 : 1,
          visibility: window.location.pathname === '/' && !sessionStorage.getItem('tutorialVisible') ? 'hidden' : 'visible'
        }}
      >
        <Card className="max-w-sm p-4 bg-card/95 backdrop-blur-[2px] border border-primary/30 shadow-2xl">
        <div className="mb-3">
          <h3 className="font-semibold text-foreground">{currentStepData.title}</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {currentStepData.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex-1 mr-4">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{
                  width: `${((steps.findIndex(s => s.id === currentStep) + 1) / steps.length) * 100}%`
                }}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Previous button clicked');
                previousStep();
              }}
              size="sm"
              variant="outline"
              disabled={steps.findIndex(s => s.id === currentStep) === 0}
              className="pointer-events-auto"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            {/* Only show next button if not on the last step */}
            {steps.findIndex(s => s.id === currentStep) < steps.length - 1 && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Next button clicked, current step:', currentStep);
                  nextStep();
                }}
                size="sm"
                className={`pointer-events-auto ${
                  isCurrentStepValid() 
                    ? 'bg-primary hover:bg-primary/90' 
                    : 'bg-muted-foreground/50 hover:bg-muted-foreground/60'
                }`}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        </Card>
      </div>
    </>
  );
};
