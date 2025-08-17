import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowDown } from 'lucide-react';


import CreateWorkspace from './CreateWorkspace';

const LandingPage = () => {
  const [tutorialVisible, setTutorialVisible] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [showCursor, setShowCursor] = useState(true);



  // Typewriter effect for tutorial text
  useEffect(() => {
    const fullText = 'Scroll down to view the tutorial';
    const typingSpeed = 3000 / fullText.length; // 3 seconds total
    
    const typeText = () => {
      for (let i = 0; i <= fullText.length; i++) {
        setTimeout(() => {
          setTypewriterText(fullText.substring(0, i));
          
          // Start cursor blinking when text is complete
          if (i === fullText.length) {
            const cursorInterval = setInterval(() => {
              setShowCursor(prev => !prev);
            }, 500);
            
            // Clean up cursor interval
            return () => clearInterval(cursorInterval);
          }
        }, i * typingSpeed);
      }
    };

    // Start typing after a short delay
    const timer = setTimeout(typeText, 1000);
    
    return () => clearTimeout(timer);
  }, []);

      return (
      <div className="bg-slate-900">
        {/* Scrollable content container */}
        <div className="relative">
          {/* Simple Hero Section */}
          <section className="w-full h-screen bg-slate-900 relative">
            {/* Grid Background */}
            <div 
              className="absolute z-[20000] pointer-events-none"
              style={{
                top: 0,
                left: 0,
                right: 0,
                height: '150vh',
                backgroundImage: `
                  linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: `50px 50px, 50px 50px`,
                backgroundPosition: `0 0, 0 0`,
                filter: 'blur(0.3px)',
                maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0) 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0) 100%)'
              }}
            />
            

            
            {/* Hero Content */}
            <div className="relative z-[25000] w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
              {/* Video Section */}
              <div className="relative">
                <video 
                  src="/intro.mp4" 
                  className="max-w-full h-auto max-h-[70vh] object-contain rounded-xl shadow-2xl"
                  autoPlay 
                  muted 
                  playsInline
                />
              </div>
            </div>
            
            {/* Scroll Indicator - Simple gray bouncing arrow */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[35000]">
              <div className="animate-bounce">
                <ArrowDown className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
              </div>
            </div>
          </section>

          {/* Spacer to move tutorial lower */}
          <div className="h-[20vh] bg-slate-900"></div>

          {/* Tutorial Section */}
          <div className="bg-slate-900 min-h-screen relative z-[1]" data-tutorial-section>
            <CreateWorkspace />
          </div>
      </div>

    </div>
  );
};

export default LandingPage;
