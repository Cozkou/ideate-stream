import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, Users, Bot, Zap, ArrowDown } from 'lucide-react';
import CreateWorkspace from './CreateWorkspace';

const LandingPage = () => {
  const [showTutorial, setShowTutorial] = useState(true); // Load tutorial immediately
  const [tutorialVisible, setTutorialVisible] = useState(false); // Control visibility
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

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

  useEffect(() => {
    const handleLaptopScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = window.innerHeight * 2; // 2 viewport heights of scroll
      const progress = Math.min(scrollPosition / maxScroll, 1);
      setScrollProgress(progress);
    };

    // Always listen for scroll since laptop is always visible
    window.addEventListener('scroll', handleLaptopScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleLaptopScroll);
    };
  }, []);

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
      {/* Fixed Laptop Hero Section */}
      <section className="fixed inset-0 w-full h-screen flex flex-col items-center justify-center z-[10000] bg-background">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Fixed Laptop Container with Scrolling Content Inside */}
          <div className="relative w-full flex justify-center">
            {/* Laptop Image - Always Fixed and Bigger */}
            <div className="relative w-full max-w-6xl">
              <img 
                src="/monitor.png" 
                alt="Laptop" 
                className="w-full h-auto relative z-10 scale-110"
              />
              
              {/* Scrolling Content - Top Left Aligned */}
              <div className="absolute inset-0 flex items-start justify-start pt-8 md:pt-12 lg:pt-16 pl-16 md:pl-20 lg:pl-24 z-20">
                {/* Text content area - positioned on the left with transparent background */}
                <div className="w-[45%] h-[80%] relative overflow-hidden">
                  
                  {/* Scrollable content container */}
                  <div className="relative w-full h-full overflow-hidden">
                    <div 
                      className="absolute inset-0 px-6 sm:px-8 py-6 transition-transform duration-75 ease-linear"
                      style={{
                        transform: `translateY(${-scrollProgress * 200}px)`, // Scroll the content
                        height: 'fit-content',
                        minHeight: '100%'
                      }}
                    >
                      {/* All content stacked vertically */}
                      <div className="space-y-10 md:space-y-14 font-mono">
                        {/* Heading */}
                        <div className="text-left py-6">
                          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black text-white mb-4 md:mb-6 leading-tight tracking-tight">
                            Welcome to <span className="text-emerald-400 drop-shadow-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">COMPT</span>
                          </h1>
                          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-slate-300 font-semibold leading-relaxed tracking-wide">
                            Turn scattered prompts into a shared conversation
                          </p>
                        </div>

                        {/* First Message */}
                        <div className="text-left py-8 border-l-4 border-emerald-400/50 pl-6">
                          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-slate-100 leading-relaxed tracking-wide">
                            One space where everyone and the AI stay on the same page.
                          </p>
                        </div>

                        {/* Second Message */}
                        <div className="text-left py-8 border-l-4 border-blue-400/50 pl-6">
                          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-slate-100 leading-relaxed tracking-wide">
                            Brainstorm, branch ideas, and refine prompts in real time to turn collaboration into better answers faster.
                          </p>
                        </div>

                        {/* Extra content for scrolling */}
                        <div className="text-left py-8 border-l-4 border-purple-400/50 pl-6">
                          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-slate-200 leading-relaxed tracking-wide">
                            Experience seamless collaboration with AI-powered ideation tools.
                          </p>
                        </div>

                        {/* Additional content for more scrolling */}
                        <div className="text-left py-8">
                          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-emerald-300 mb-4 tracking-tight">
                            Key Features
                          </h2>
                          <ul className="space-y-3 text-base sm:text-lg md:text-xl lg:text-2xl text-slate-200 font-medium">
                            <li className="flex items-center">
                              <span className="w-3 h-3 bg-emerald-400 rounded-full mr-4 shadow-lg shadow-emerald-400/50"></span>
                              Real-time collaboration
                            </li>
                            <li className="flex items-center">
                              <span className="w-3 h-3 bg-blue-400 rounded-full mr-4 shadow-lg shadow-blue-400/50"></span>
                              AI-powered insights
                            </li>
                            <li className="flex items-center">
                              <span className="w-3 h-3 bg-purple-400 rounded-full mr-4 shadow-lg shadow-purple-400/50"></span>
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

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <ArrowDown className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Spacer to allow scrolling for content animation */}
      <div className="h-[300vh] relative z-[1]">
        {/* This creates scroll space for the laptop content animation */}
      </div>


    </div>
  );
};

export default LandingPage;
