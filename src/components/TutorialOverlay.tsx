
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTutorial } from '@/contexts/TutorialContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const TutorialOverlay: React.FC = () => {
  const { isActive, currentStep, steps, nextStep, previousStep, isCurrentStepValid } = useTutorial();
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentStepData = steps.find(step => step.id === currentStep);

  const handleNextStep = () => {
    setIsTransitioning(true);
    // Add blur to current highlighted element
    if (highlightedElement && highlightedElement instanceof HTMLElement) {
      highlightedElement.style.filter = 'blur(2px)';
      highlightedElement.style.transition = 'filter 0.4s ease-in-out';
    }
    setTimeout(() => {
      nextStep();
      setTimeout(() => {
        setIsTransitioning(false);
        // Remove blur from new highlighted element
        if (highlightedElement && highlightedElement instanceof HTMLElement) {
          highlightedElement.style.filter = 'none';
        }
      }, 150);
    }, 150);
  };

  const handlePreviousStep = () => {
    setIsTransitioning(true);
    // Add blur to current highlighted element
    if (highlightedElement && highlightedElement instanceof HTMLElement) {
      highlightedElement.style.filter = 'blur(2px)';
      highlightedElement.style.transition = 'filter 0.4s ease-in-out';
    }
    setTimeout(() => {
      previousStep();
      setTimeout(() => {
        setIsTransitioning(false);
        // Remove blur from new highlighted element
        if (highlightedElement && highlightedElement instanceof HTMLElement) {
          highlightedElement.style.filter = 'none';
        }
      }, 150);
    }, 150);
  };

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
             {/* Blur overlay sections that avoid the highlighted element */}
       {highlightedElement ? (
         <>
           {/* Top section */}
           <div 
             className="fixed z-[9998] pointer-events-none backdrop-blur-sm bg-black/30" 
             style={{
               top: 0,
               left: 0,
               right: 0,
               height: highlightedElement.getBoundingClientRect().top - 8
             }}
           />
           {/* Bottom section */}
           <div 
             className="fixed z-[9998] pointer-events-none backdrop-blur-sm bg-black/30" 
             style={{
               top: highlightedElement.getBoundingClientRect().bottom + 8,
               left: 0,
               right: 0,
               bottom: 0
             }}
           />
           {/* Left section */}
           <div 
             className="fixed z-[9998] pointer-events-none backdrop-blur-sm bg-black/30" 
             style={{
               top: highlightedElement.getBoundingClientRect().top - 8,
               left: 0,
               width: highlightedElement.getBoundingClientRect().left - 8,
               height: highlightedElement.getBoundingClientRect().height + 16
             }}
           />
           {/* Right section */}
           <div 
             className="fixed z-[9998] pointer-events-none backdrop-blur-sm bg-black/30" 
             style={{
               top: highlightedElement.getBoundingClientRect().top - 8,
               left: highlightedElement.getBoundingClientRect().right + 8,
               right: 0,
               height: highlightedElement.getBoundingClientRect().height + 16
             }}
           />
         </>
       ) : (
         // Full screen blur when no element is highlighted
         <div 
           className="fixed inset-0 z-[9998] pointer-events-none backdrop-blur-sm bg-black/30" 
         />
       )}
      
      {/* Just a border highlight - no background to block content */}
      {highlightedElement && (
        <div
          className={`fixed z-[10000] pointer-events-none transition-opacity duration-400 ease-in-out ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            top: highlightedElement.getBoundingClientRect().top - 8,
            left: highlightedElement.getBoundingClientRect().left - 8,
            width: highlightedElement.getBoundingClientRect().width + 16,
            height: highlightedElement.getBoundingClientRect().height + 16,
            borderRadius: '8px',
            border: '2px solid #3b82f6',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
          }}
        />
      )}
      
      {/* Tutorial tooltip - positioned directly underneath/on top of highlighted element */}
      <div
        className={`fixed z-[50000] pointer-events-auto transition-opacity duration-400 ease-in-out ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          left: highlightedElement ? highlightedElement.getBoundingClientRect().left : '50%',
          top: highlightedElement ? (
            currentStep === 'goal-input' || currentStep === 'context-section' 
              ? highlightedElement.getBoundingClientRect().bottom + 16  // Steps 1 & 2: underneath
              : highlightedElement.getBoundingClientRect().top - 16 - 200  // Steps 3 & 4: on top (approximate modal height)
          ) : '50%'
        }}
      >
        <Card className="max-w-sm p-4 bg-card border border-primary/30 shadow-2xl">
        <div className="mb-3">
          <h3 className="font-semibold text-foreground">{currentStepData.title}</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {currentStepData.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Step {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Previous button clicked');
                handlePreviousStep();
              }}
              size="sm"
              variant="outline"
              disabled={steps.findIndex(s => s.id === currentStep) === 0 || isTransitioning}
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
                  handleNextStep();
                }}
                size="sm"
                className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isTransitioning}
              >
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Progress bar at bottom */}
        <div className="mt-4">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{
                width: `${((steps.findIndex(s => s.id === currentStep) + 1) / steps.length) * 100}%`
              }}
            />
          </div>
        </div>
        </Card>
      </div>
    </>
  );
};
