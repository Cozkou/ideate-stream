import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, Users, Bot, Zap, ArrowDown } from 'lucide-react';


import CreateWorkspace from './CreateWorkspace';

const LandingPage = () => {
  const [tutorialVisible, setTutorialVisible] = useState(false); // Control visibility

  const laptopContent = [
    {
      type: "heading",
      content: (
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-2 md:mb-4">
            Welcome to <span className="text-primary">COMPT</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 font-medium">
            Turn scattered prompts into a shared conversation
          </p>
        </div>
      )
    },
    {
      type: "message",
      content: (
        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-foreground text-center">
          One space where everyone and the AI stay on the same page.
        </p>
      )
    },
    {
      type: "message", 
      content: (
        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-foreground text-center">
          Brainstorm, branch ideas, and refine prompts in real time to turn collaboration into better answers faster.
        </p>
      )
    }
  ];

  // Handle real-time scroll inside laptop
  const [scrollProgress, setScrollProgress] = useState(0);
  const [laptopComplete, setLaptopComplete] = useState(false);
  const [laptopOffset, setLaptopOffset] = useState(0);

  useEffect(() => {
    const handleLaptopScroll = () => {
      const scrollPosition = window.scrollY;
      const laptopContentScroll = window.innerHeight * 2; // Extended scroll for laptop content
      const laptopExitScroll = window.innerHeight * 3; // When laptop should be fully scrolled out
      
      // Calculate content progress (0-1 for laptop content animation)
      const contentProgress = Math.min(scrollPosition / laptopContentScroll, 1);
      setScrollProgress(contentProgress);
      
      // Mark laptop animation as complete when all content is visible
      if (contentProgress >= 1 && !laptopComplete) {
        setLaptopComplete(true);
      }
      
      // Calculate laptop exit offset after content is complete
      if (laptopComplete && scrollPosition > laptopContentScroll) {
        const exitProgress = (scrollPosition - laptopContentScroll) / (laptopExitScroll - laptopContentScroll);
        const offset = Math.min(exitProgress * window.innerHeight, window.innerHeight);
        setLaptopOffset(offset);
        
        // Auto-scroll to tutorial when laptop is mostly scrolled out
        if (exitProgress >= 0.6 && !tutorialVisible) {
          setTutorialVisible(true);
          
          // Auto-scroll to tutorial section with longer animation
          const tutorialSection = document.querySelector('[data-tutorial-section]');
          if (tutorialSection) {
            // Use custom smooth scroll with longer duration
            const startPosition = window.scrollY;
            const targetPosition = tutorialSection.offsetTop;
            const distance = targetPosition - startPosition;
            const duration = 2000; // 2 seconds instead of default smooth scroll
            let start = null;

            function smoothScroll(timestamp) {
              if (!start) start = timestamp;
              const progress = timestamp - start;
              const percentage = Math.min(progress / duration, 1);
              
              // Easing function for smooth animation
              const easeInOutCubic = percentage < 0.5 
                ? 4 * percentage * percentage * percentage 
                : 1 - Math.pow(-2 * percentage + 2, 3) / 2;
              
              window.scrollTo(0, startPosition + distance * easeInOutCubic);
              
              if (progress < duration) {
                requestAnimationFrame(smoothScroll);
              } else {
                // Lock scroll position once tutorial is reached
                document.body.style.overflow = 'hidden';
                window.scrollTo(0, targetPosition);
              }
            }
            
            requestAnimationFrame(smoothScroll);
          }
          
          // Let CreateWorkspace handle its own tutorial setup - don't override it
        }
      } else {
        setLaptopOffset(0);
      }
    };

    // Always listen for scroll since laptop is always visible
    window.addEventListener('scroll', handleLaptopScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleLaptopScroll);
    };
  }, [laptopComplete, tutorialVisible]);

  // Disable tutorial trigger - laptop stays fixed
  useEffect(() => {
    // No tutorial triggering - just allow normal scrolling
    console.log('Tutorial trigger disabled - laptop stays fixed');
  }, []);

  // Cleanup scroll lock when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

      return (
      <div className="bg-background">
        {/* Scrollable content container */}
        <div className="relative">
          {/* Laptop Hero Section - Scrolls up after content complete */}
          <section 
            className="sticky top-0 w-full h-screen flex flex-col items-center justify-center bg-background z-[20000]"
          style={{
            transform: `translateY(-${laptopOffset}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
            
            {/* Fixed Laptop Container with Scrolling Content Inside */}
            <div className="relative w-full flex justify-center">
              {/* Laptop Image - Responsive sizing */}
              <div className="relative w-full max-w-3xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl -mt-4 sm:-mt-6 md:-mt-8">
                <img 
                  src="/monitor3.png" 
                  alt="Laptop" 
                  className="w-full h-auto relative z-[25000] scale-90 sm:scale-95 md:scale-100"
                />
                
                {/* Scrolling Content - Responsive positioning */}
                <div className="absolute inset-0 flex items-start justify-start pt-2 sm:pt-3 md:pt-4 lg:pt-6 xl:pt-8 pl-6 sm:pl-8 md:pl-12 lg:pl-16 xl:pl-20 2xl:pl-24 z-[30000]">
                  {/* Text content area - responsive sizing */}
                  <div className="w-[40%] sm:w-[38%] md:w-[35%] lg:w-[32%] h-[65%] sm:h-[68%] md:h-[70%] lg:h-[72%] relative overflow-hidden">
                    
                    {/* Scrollable content container */}
                    <div className="relative w-full h-full overflow-hidden">
                      <div 
                        className="absolute inset-0 px-1 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-2 transition-transform duration-75 ease-linear"
                        style={{
                          transform: `translateY(${-scrollProgress * (window.innerWidth < 768 ? 250 : window.innerWidth < 1024 ? 300 : 400)}px)`, // More responsive scroll distance
                          height: 'fit-content',
                          minHeight: '100%'
                        }}
                      >
                        {/* All content stacked vertically */}
                        <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-14 font-mono">
                          {/* Heading */}
                          <div className="text-left py-2 sm:py-3 md:py-4 lg:py-6">
                            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-black text-white mb-1 sm:mb-2 md:mb-3 lg:mb-4 leading-tight tracking-tight">
                              Welcome to <span className="text-emerald-400 drop-shadow-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">COMPT</span>
                            </h1>
                            <p className="text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg text-slate-300 font-semibold leading-relaxed tracking-wide">
                              Turn scattered prompts into a shared conversation
                            </p>
                          </div>

                          {/* First Message */}
                          <div className="text-left py-2 sm:py-3 md:py-4 lg:py-6 border-l-2 sm:border-l-3 md:border-l-4 border-emerald-400/50 pl-2 sm:pl-3 md:pl-4 lg:pl-6">
                            <p className="text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg font-semibold text-slate-100 leading-relaxed tracking-wide">
                              One space where everyone and the AI stay on the same page.
                            </p>
                          </div>

                          {/* Second Message */}
                          <div className="text-left py-2 sm:py-3 md:py-4 lg:py-6 border-l-2 sm:border-l-3 md:border-l-4 border-blue-400/50 pl-2 sm:pl-3 md:pl-4 lg:pl-6">
                            <p className="text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg font-semibold text-slate-100 leading-relaxed tracking-wide">
                              Brainstorm, branch ideas, and refine prompts in real time to turn collaboration into better answers faster.
                            </p>
                          </div>

                          {/* Extra content for scrolling */}
                          <div className="text-left py-2 sm:py-3 md:py-4 lg:py-6 border-l-2 sm:border-l-3 md:border-l-4 border-purple-400/50 pl-2 sm:pl-3 md:pl-4 lg:pl-6">
                            <p className="text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg font-semibold text-slate-200 leading-relaxed tracking-wide">
                              Experience seamless collaboration with AI-powered ideation tools.
                            </p>
                          </div>

                          {/* Additional content for more scrolling */}
                          <div className="text-left py-2 sm:py-3 md:py-4 lg:py-6">
                            <h2 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold text-emerald-300 mb-1 sm:mb-2 md:mb-3 tracking-tight">
                              Key Features
                            </h2>
                            <ul className="space-y-1 sm:space-y-2 md:space-y-3 text-xs sm:text-xs md:text-sm lg:text-base text-slate-200 font-medium">
                              <li className="flex items-center">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-emerald-400 rounded-full mr-1.5 sm:mr-2 md:mr-3 lg:mr-4 shadow-lg shadow-emerald-400/50"></span>
                                Real-time collaboration
                              </li>
                              <li className="flex items-center">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-blue-400 rounded-full mr-1.5 sm:mr-2 md:mr-3 lg:mr-4 shadow-lg shadow-blue-400/50"></span>
                                AI-powered insights
                              </li>
                              <li className="flex items-center">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-purple-400 rounded-full mr-1.5 sm:mr-2 md:mr-3 lg:mr-4 shadow-lg shadow-purple-400/50"></span>
                                Structured workflows
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Blur overlay for consistent visual treatment */}
          <div className="fixed inset-0 z-[15000] pointer-events-none backdrop-blur-md bg-black/40" />

                      {/* Scroll Indicator */}
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 scroll-indicator z-[35000]">
              <div className="animate-bounce">
                <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-gray-400" />
              </div>
            </div>
        </section>

        {/* Spacer for laptop scroll - this creates the actual scrollable height */}
        <div className="h-[250vh] bg-transparent">
          {/* This creates scroll space for the laptop content animation AND laptop exit */}
        </div>

                  {/* Tutorial Section */}
          <div className="bg-background min-h-screen relative z-[1]" data-tutorial-section>
            <CreateWorkspace />
          </div>
      </div>

    </div>
  );
};

export default LandingPage;
