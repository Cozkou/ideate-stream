import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ChevronLeft, Pause, Play, ChevronRight } from 'lucide-react';
import { ArrowDown } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'command' | 'image' | 'clear'>('enter');
  const [currentTypingLine, setCurrentTypingLine] = useState<string>('');
  const [showImage, setShowImage] = useState(false);
  const [demoStarted, setDemoStarted] = useState(false);
  const [showHeroText, setShowHeroText] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const activeTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const activeIntervalsRef = useRef<NodeJS.Timeout[]>([]);

  // Helpers for pause-aware scheduling and cleanup
  const clearAllTimers = () => {
    activeTimeoutsRef.current.forEach(clearTimeout);
    activeIntervalsRef.current.forEach(clearInterval);
    activeTimeoutsRef.current = [];
    activeIntervalsRef.current = [];
  };

  const pauseAwareDelay = (ms: number, cb: () => void) => {
    let elapsed = 0;
    const tick = 50;
    const id = setInterval(() => {
      if (isPausedRef.current) return;
      elapsed += tick;
      if (elapsed >= ms) {
        clearInterval(id);
        cb();
      }
    }, tick);
    activeIntervalsRef.current.push(id as unknown as NodeJS.Timeout);
    return id;
  };


  const heroSentences = ["Innovation happens when minds collide.", "The best ideas emerge from collaboration.", "AI amplifies human creativity.", "Together we build the impossible.", "Every breakthrough starts with a conversation.", "Collective intelligence beats individual genius.", "The future is collaborative by design."];
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [heroText, setHeroText] = useState('');

  // Typewriter effect function (pause-aware)
  const typeText = (text: string, callback: () => void, speed = 50) => {
    let i = 0;
    setCurrentTypingLine('');
    const timer = setInterval(() => {
      if (isPausedRef.current) return;
      setCurrentTypingLine(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        // small delay before callback (pause-aware)
        pauseAwareDelay(200, callback);
      }
    }, speed);
    activeIntervalsRef.current.push(timer as unknown as NodeJS.Timeout);
    return timer;
  };

  // Animation system with pause/resume support
  useEffect(() => {
    if (!demoStarted) return;
    
    // clear any existing timers if switching steps
    clearAllTimers();

    const startStepAnimation = (step: number) => {
      // Reset for this step
      setTerminalLines([]);
      setCurrentTypingLine('');
      setShowImage(false);
      setAnimationPhase('command');
      setCurrentStep(step);

      // Phase 1: Type tutorial command
      const interval1 = typeText(`$ tutorial step ${step}`, () => {
        setTerminalLines([`$ tutorial step ${step}`, `Loading tutorial step ${step}...`]);
        setCurrentTypingLine('');

        // Wait then type step message
        pauseAwareDelay(800, () => {
          const stepMsgInterval = typeText(`--- Tutorial Step ${step} ---`, () => {
            setTerminalLines(prev => [...prev, `--- Tutorial Step ${step} ---`]);
            setCurrentTypingLine('');

            // Wait then show image
            pauseAwareDelay(600, () => {
              setAnimationPhase('image');
              setShowImage(true);

              // Display image for 11s, then clear
              pauseAwareDelay(11000, () => {
                setAnimationPhase('clear');
                const clearIntervalId = typeText('$ clear', () => {
                  setTerminalLines(prev => [...prev, '$ clear']);
                  setCurrentTypingLine('');
                  setShowImage(false);

                  // Wait then next step or restart
                  pauseAwareDelay(800, () => {
                    if (step < 3) {
                      startStepAnimation(step + 1);
                    } else {
                      pauseAwareDelay(1000, () => startStepAnimation(1));
                    }
                  });
                }, 100);
                activeIntervalsRef.current.push(clearIntervalId as unknown as NodeJS.Timeout);
              });
            });
          }, 50);
          activeIntervalsRef.current.push(stepMsgInterval as unknown as NodeJS.Timeout);
        });
      }, 80);
      activeIntervalsRef.current.push(interval1 as unknown as NodeJS.Timeout);
    };

    startStepAnimation(currentStep);

    return () => {
      clearAllTimers();
    };
  }, [demoStarted, currentStep]);

  // Hero typing animation effect
  useEffect(() => {
    let canceled = false;
    const timers: number[] = [];
    const currentSentence = heroSentences[currentSentenceIndex];
    let charIndex = 0;
    const typingSpeed = 80;
    const deleteSpeed = 50;
    const pauseBetweenSentences = 2000;
    const pauseBeforeDelete = 1500;
    const typeNextCharacter = () => {
      if (canceled) return;
      if (charIndex <= currentSentence.length) {
        setHeroText(currentSentence.substring(0, charIndex));
        charIndex++;
        const t = window.setTimeout(typeNextCharacter, typingSpeed);
        timers.push(t);
      } else {
        const t1 = window.setTimeout(() => {
          const deleteCharacter = () => {
            if (canceled) return;
            if (charIndex > 0) {
              charIndex--;
              setHeroText(currentSentence.substring(0, charIndex));
              const t2 = window.setTimeout(deleteCharacter, deleteSpeed);
              timers.push(t2);
            } else {
              const t3 = window.setTimeout(() => {
                if (!canceled) {
                  setCurrentSentenceIndex(prevIndex => (prevIndex + 1) % heroSentences.length);
                }
              }, pauseBetweenSentences);
              timers.push(t3);
            }
          };
          deleteCharacter();
        }, pauseBeforeDelete);
        timers.push(t1);
      }
    };
    typeNextCharacter();
    return () => {
      canceled = true;
      timers.forEach(id => clearTimeout(id));
    };
  }, [currentSentenceIndex]);

  // Handle terminal click/enter to start demo
  const handleStartDemo = () => {
    if (!demoStarted) {
      setDemoStarted(true);
      // Hide hero text with animation
      setShowHeroText(false);
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !demoStarted) {
        handleStartDemo();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [demoStarted]);

  // Navigation control functions
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      clearAllTimers();
      setShowImage(false);
      setTerminalLines([]);
      setCurrentTypingLine('');
      setIsPaused(false);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      clearAllTimers();
      setShowImage(false);
      setTerminalLines([]);
      setCurrentTypingLine('');
      setIsPaused(false);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleTogglePause = () => {
    setIsPaused((p) => !p);
  };

  // Keep ref in sync with state
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Email submission handler
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      // Tally API endpoint - you'll need to replace this with your actual Tally form ID
      const tallyFormId = 'w2jbzj'; // Replace with your actual form ID
      const response = await fetch(`https://tally.so/api/forms/${tallyFormId}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            email: email
          }
        })
      });
      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: 'Thank you! You\'ve been subscribed to our updates.'
        });
        setEmail('');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Email submission error:', error);
      setSubmitStatus({
        success: false,
        message: 'Sorry, there was an error. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-background min-h-screen">
        {/* Header Section */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                {/* Left side content can be added here if needed */}
              </div>
              <div className="flex items-center">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors" 
                  onClick={() => {
                    const waitlistSection = document.querySelector('[data-waitlist-section]');
                    waitlistSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Join Waitlist
                </Button>
              </div>
            </div>
          </div>
          
          {/* COMPT Logo positioned to extend downward from header */}
          <div className="absolute -bottom-8 left-0 p-4">
            <img 
              src="/COMPT.png" 
              alt="COMPT Logo" 
              className="h-20 sm:h-25 cursor-pointer" 
              onClick={() => navigate('/')} 
            />
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12 sm:py-16 lg:py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Text - Hide when demo starts */}
            <div className={`text-center mb-8 sm:mb-12 lg:mb-16 transition-all duration-700 ${showHeroText ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
              {/* Gradient background behind title */}
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-600/20 via-gray-500/10 to-blue-400/20 blur-3xl rounded-full -z-10 transform -translate-y-8"></div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-mono relative z-10">
                The Collaborative AI Workspace
              </h1>
              <div className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed px-4 min-h-[3rem] flex items-center justify-center font-mono">
                <span className="text-gray-900 dark:text-white">
                  {heroText}
                  <span className="animate-pulse bg-gray-900 dark:bg-white w-0.5 h-6 inline-block ml-1"></span>
                </span>
              </div>
            </div>

            {/* Terminal Demo Section */}
            <div className={`max-w-5xl mx-auto transition-all duration-700 ${!showHeroText ? '-translate-y-32 pt-8' : ''}`}>
              <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
                {/* Terminal Header */}
                <div className="bg-gray-800 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-400 text-xs sm:text-sm font-mono ml-2 sm:ml-4">Interactive Demo</span>
                      
                      {/* Navigation Controls - Show only when demo is started */}
                      {demoStarted && (
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={handlePreviousStep}
                            disabled={currentStep <= 1}
                            className={`p-1 rounded-md transition-colors ${
                              currentStep <= 1 
                                ? 'text-gray-600 cursor-not-allowed' 
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                          >
                            <ChevronLeft size={16} />
                          </button>
                          
                          <button
                            onClick={handleTogglePause}
                            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                          >
                            {isPaused ? <Play size={16} /> : <Pause size={16} />}
                          </button>
                          
                          <button
                            onClick={handleNextStep}
                            disabled={currentStep >= 3}
                            className={`p-1 rounded-md transition-colors ${
                              currentStep >= 3 
                                ? 'text-gray-600 cursor-not-allowed' 
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="text-gray-500 text-xs sm:text-sm">compt-demo</div>
                  </div>
                </div>

                {/* Terminal Content */}
                <div 
                  className="bg-black p-3 sm:p-4 lg:p-6 min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] font-mono text-sm sm:text-base leading-relaxed cursor-pointer"
                  onClick={handleStartDemo}
                >
                  {/* Initial state before demo starts */}
                  {!demoStarted && (
                    <div className="h-full">
                      <div className="text-left">
                        <div className="text-cyan-400 text-xl font-bold mb-4">Interactive Demo</div>
                        <div className="text-gray-300 mb-2">Press Enter or click to view sneak peek</div>
                        <div className="text-emerald-400 animate-pulse">▶ Start Demo</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Demo content when started */}
                  {demoStarted && (
                    <>
                      {/* Display completed terminal lines */}
                      {terminalLines.map((line, index) => (
                        <div key={index} className="mb-1">
                          <span className={`${
                            line.startsWith('$') ? 'text-emerald-400 font-semibold' : 
                            line.includes('Tutorial Step') ? 'text-cyan-400 font-bold' : 
                            line.includes('Loading') ? 'text-yellow-300 font-medium' : 
                            'text-gray-100'
                          }`}>
                            {line}
                          </span>
                        </div>
                      ))}
                      
                      {/* Display currently typing line */}
                      {currentTypingLine && (
                        <div className="mb-1">
                          <span className={`${
                            currentTypingLine.startsWith('$') ? 'text-emerald-400 font-semibold' : 
                            currentTypingLine.includes('Tutorial Step') ? 'text-cyan-400 font-bold' : 
                            currentTypingLine.includes('Loading') ? 'text-yellow-300 font-medium' : 
                            'text-gray-100'
                          }`}>
                            {currentTypingLine}
                            <span className="animate-pulse bg-emerald-400 w-2 h-4 inline-block ml-1"></span>
                          </span>
                        </div>
                      )}
                      
                      {/* Display image on the left when in image phase */}
                      {showImage && (
                        <div className="mt-4 mb-4">
                          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                            {/* Image container on the left */}
                            <div className="bg-gray-800 p-3 rounded-lg border border-gray-600 shadow-lg w-full sm:w-auto sm:flex-shrink-0 sm:max-w-md md:max-w-lg lg:max-w-xl overflow-hidden">
                              <img 
                                src={`/step${currentStep}.png`}
                                alt={`Tutorial Step ${currentStep}`}
                                className="w-full max-w-full h-auto object-contain rounded max-h-[50vh] sm:max-h-none"
                              />
                              <div className="text-center mt-2">
                                <span className="text-cyan-400 text-xs font-medium">Step {currentStep} of 3</span>
                              </div>
                            </div>
                            
                            {/* Terminal output area on the right */}
                            <div className="flex-1 min-w-0">
                              {/* This space can show additional terminal output if needed */}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is COMPT Section */}
        <section id="features" className="py-12 sm:py-16 lg:py-24 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                What is COMPT?
              </h3>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
                The only workspace that brings your team and AI together in one place. Here's how it compares:
              </p>
            </div>
            
            {/* Comparison Table */}
            <div className="w-full">
              <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-3 sm:p-4 font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Feature</th>
                    <th className="text-center p-3 sm:p-4 font-semibold text-gray-900 dark:text-white">
                      <div className="flex flex-col items-center">
                        <span className="text-lg sm:text-xl font-bold text-cyan-600">COMPT</span>
                      </div>
                    </th>
                    <th className="text-center p-3 sm:p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      <div className="flex flex-col items-center">
                        <img src="/ailogos.png" alt="AI Logos" className="h-auto w-auto max-h-10 sm:max-h-12 md:max-h-14 object-contain" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td className="p-3 sm:p-4 font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      <div className="flex items-center gap-2">
                        Team + AI Collaboration
                        <div className="relative group/info">
                          <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">i</span>
                          </div>
                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-4 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover/info:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-80">
                            <div className="text-center">
                              Collaborate seamlessly with your team members and multiple AI agents simultaneously. Everyone can contribute ideas while AI agents provide real-time assistance and insights.
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 text-center">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="p-3 sm:p-4 text-center text-gray-400 text-sm sm:text-base">Solo only</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td className="p-3 sm:p-4 font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      <div className="flex items-center gap-2">
                        Real-time Sync
                        <div className="relative group/info">
                          <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">i</span>
                          </div>
                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-4 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover/info:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-80">
                            <div className="text-center">
                              Experience instant synchronization across all participants. Every message, edit, or AI response appears immediately for everyone, ensuring no one misses important updates.
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 text-center">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="p-3 sm:p-4 text-center text-gray-400 text-sm sm:text-base">No</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        Context Preservation
                        <div className="relative group/info">
                          <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">i</span>
                          </div>
                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-4 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover/info:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-80">
                            <div className="text-center">
                              Never lose track of important conversations. All context, decisions, and insights are preserved across sessions, making it easy to pick up where you left off.
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="p-4 text-center text-gray-400">Limited</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        Multiple AI Agents
                        <div className="relative group/info">
                          <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">i</span>
                          </div>
                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-4 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover/info:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-80">
                            <div className="text-center">
                              Access a team of specialized AI agents, each with unique expertise. From creative brainstorming to technical analysis, get the right AI for every task.
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="p-4 text-center text-gray-400">Single AI</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        Prompt Versioning
                        <div className="relative group/info">
                          <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">i</span>
                          </div>
                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-4 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover/info:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-80">
                            <div className="text-center">
                              Keep track of all your AI prompt iterations. Compare versions, revert changes, and maintain a history of your prompt evolution for better results.
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="p-4 text-center text-gray-400">No</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        Branch Conversations
                        <div className="relative group/info">
                          <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">i</span>
                          </div>
                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-4 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover/info:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-80">
                            <div className="text-center">
                              Explore multiple ideas simultaneously by creating conversation branches. Test different approaches without losing your original thread of thought.
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="p-4 text-center text-gray-400">No</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-500 dark:text-gray-400 text-center" colSpan={3}>
                      More coming...
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800" data-waitlist-section>
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-space text-cyan-600">
                Join Our Waitlist
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input type="email" placeholder="Enter your email address" className="w-full px-6 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-cyan-600/50 focus:border-cyan-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 shadow-xl shadow-cyan-600/40 hover:shadow-2xl hover:shadow-cyan-600/60 focus:shadow-2xl focus:shadow-cyan-600/80 text-lg" />
              </div>
              <div className="p-3 border-2 border-cyan-600 dark:border-cyan-600 rounded-lg bg-white dark:bg-gray-900 hover:border-cyan-700 transition-colors duration-200 shadow-lg shadow-cyan-600/30">
                <ArrowDown className="w-8 h-8 text-cyan-600 dark:text-cyan-600 rotate-[-90deg]" />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <img 
                  src="/COMPT.png" 
                  alt="COMPT Logo" 
                  className="h-20 sm:h-24 lg:h-28 cursor-pointer" 
                  onClick={() => navigate('/')}
                />
                <p className="text-gray-600 dark:text-gray-300 max-w-md text-sm mt-1">
                  A new way to prompt, coprompt.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4 items-center">
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Contact Us</h5>
                  <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-transparent p-0 font-medium transition-colors text-sm" onClick={() => window.open('https://linkedin.com/company/compt', '_blank')}>
                    LinkedIn
                  </Button>
                  <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                    compt@buildersbrew.co
                  </p>
                </div>
                
                 <div>
                   <h5 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Legal</h5>
                   <ul className="space-y-0.5">
                     <li><Link to="/legal" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm block sm:inline">Privacy Policy</Link></li>
                     <li><Link to="/legal" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm block sm:inline">Terms of Service</Link></li>
                   </ul>
                 </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300 text-xs">
                  © 2025 COMPT. All rights reserved.
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  A Builder's Brew Company
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
