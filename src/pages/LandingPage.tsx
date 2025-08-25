import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { ArrowDown } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [typingComplete, setTypingComplete] = useState(false);
  const [showEnterPrompt, setShowEnterPrompt] = useState(false);
  const [showImageShowcase, setShowImageShowcase] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Hero typing animation sentences
  const heroSentences = ["Innovation happens when minds collide.", "The best ideas emerge from collaboration.", "AI amplifies human creativity.", "Together we build the impossible.", "Every breakthrough starts with a conversation.", "Collective intelligence beats individual genius.", "The future is collaborative by design."];
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [heroText, setHeroText] = useState('');

  // Terminal commands sequence - now with phases
  const terminalPhases = [
    // Phase 0: Tutorial prompt (after 2 seconds)
    ['Press ENTER to get sneak peek']
  ];

  // Typing animation for terminal
  useEffect(() => {
    // Start typing after 2 seconds
    const timer = setTimeout(() => {
      let lineIndex = 0;
      let charIndex = 0;
      const typingSpeed = 8;
      const lineDelay = 50;
      const currentCommands = terminalPhases[0];
      const typeNextCharacter = () => {
        if (lineIndex >= currentCommands.length) {
          // Animation complete
          setTypingComplete(true);
          setTimeout(() => setShowEnterPrompt(true), 100);
          return;
        }
        const currentLine = currentCommands[lineIndex];
        if (charIndex <= currentLine.length) {
          const partialLine = currentLine.substring(0, charIndex);
          setTerminalLines(prev => {
            const newLines = [...prev];
            newLines[lineIndex] = partialLine;
            return newLines;
          });
          charIndex++;
          setTimeout(typeNextCharacter, typingSpeed);
        } else {
          // Move to next line
          lineIndex++;
          charIndex = 0;
          setTimeout(typeNextCharacter, lineDelay);
        }
      };
      typeNextCharacter();
    }, 500); // 0.5 second delay

    return () => clearTimeout(timer);
  }, []);

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

  // Handle Enter key press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && showEnterPrompt && !showImageShowcase) {
        console.log('Enter pressed, starting image showcase...');
        setTimeout(() => {
          setShowImageShowcase(true);
        }, 500);
      }
    };
    if (showEnterPrompt) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [showEnterPrompt, showImageShowcase]);

  // Handle click on terminal to trigger Enter
  const handleTerminalClick = () => {
    if (showEnterPrompt && !showImageShowcase) {
      console.log('Terminal clicked, starting image showcase...');
      setTimeout(() => {
        setShowImageShowcase(true);
      }, 500);
    }
  };

  // Auto-cycle through images when showcase is active
  useEffect(() => {
    if (!showImageShowcase) return;
    
    const interval = setInterval(() => {
      setCurrentStep(prev => prev === 3 ? 1 : prev + 1);
    }, 5000); // Change image every 5 seconds (slower)

    return () => clearInterval(interval);
  }, [showImageShowcase]);

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
      <div className="bg-background">
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
                  onClick={() => window.location.href = '/waitlist'}
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
        <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <div className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed px-4 min-h-[3rem] flex items-center justify-center">
                <span className="text-gray-900 dark:text-white">
                  {heroText}
                  <span className="animate-pulse bg-gray-900 dark:bg-white w-0.5 h-6 inline-block ml-1"></span>
                </span>
              </div>
            </div>

            {/* Terminal Demo Section or Image Showcase */}
            <div className="max-w-5xl mx-auto">
              {!showImageShowcase ? (
                /* Terminal */
                <div className={`bg-gray-900 rounded-lg shadow-2xl overflow-hidden transition-all duration-500 ${showImageShowcase ? 'animate-scale-out opacity-0' : 'animate-scale-in'}`}>
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
                      </div>
                      <div className="text-gray-500 text-xs sm:text-sm">compt-demo</div>
                    </div>
                  </div>

                  {/* Terminal Content */}
                  <div 
                    className={`bg-black p-3 sm:p-4 lg:p-6 h-[300px] sm:h-[400px] lg:h-[500px] overflow-y-auto font-mono text-sm sm:text-base leading-relaxed ${showEnterPrompt && !showImageShowcase ? 'cursor-pointer hover:bg-gray-900 transition-colors' : ''}`} 
                    onClick={handleTerminalClick}
                  >
                    {terminalLines.map((line, index) => (
                      <div key={index} className="mb-1">
                        <span className={`${
                          line.startsWith('$') ? 'text-emerald-400 font-semibold' : 
                          line.includes('Sneak Peek') ? 'text-cyan-400 font-bold' : 
                          line.includes('Press ENTER') ? 'text-cyan-300 font-medium' : 
                          'text-gray-100'
                        }`}>
                          {line}
                          {index === terminalLines.length - 1 && typingComplete && !showEnterPrompt && (
                            <span className="animate-pulse bg-emerald-400 w-2 h-4 inline-block ml-1"></span>
                          )}
                        </span>
                      </div>
                    ))}
                    
                    {/* Enhanced Enter prompt - only show when not showing image */}
                    {showEnterPrompt && !showImageShowcase && (
                      <div className="mt-4">
                        <div className="flex items-center mb-3">
                          <span className="text-emerald-400 font-semibold">$ </span>
                          <span className="animate-pulse bg-cyan-400 w-2 h-4 inline-block ml-1"></span>
                        </div>
                        <div className="text-center mt-6">
                          <div className="inline-flex items-center bg-gray-800 px-4 py-2 rounded-md border border-cyan-500/30 hover:border-cyan-500/50 transition-colors">
                            <span className="text-cyan-400 text-lg mr-2">↵</span>
                            <span className="text-cyan-300">Press ENTER to see sneak peek</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Image Showcase */
                <div className="animate-fade-in">
                  {/* Image Carousel */}
                  <div className="relative rounded-2xl p-6 overflow-hidden">
                    {/* Main Image Container */}
                    <div className="relative flex justify-center items-center min-h-[300px] sm:min-h-[350px]">
                      {[1, 2, 3].map((step) => (
                        <div
                          key={step}
                          className={`absolute transition-all duration-1000 ease-in-out ${
                            step === currentStep
                              ? 'opacity-100 scale-100 translate-x-0 z-10'
                              : 'opacity-0 scale-95 z-0'
                          }`}
                        >
                          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-200 dark:border-gray-700">
                            <img
                              src={`/step${step}.png`}
                              alt={`COMPT Step ${step}`}
                              className="w-full max-w-lg h-auto object-contain rounded"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Progress Indicators */}
                    <div className="flex justify-center items-center mt-6 space-x-3">
                      {[1, 2, 3].map((step) => (
                        <div
                          key={step}
                          className={`transition-all duration-300 cursor-pointer ${
                            step === currentStep
                              ? 'w-8 h-2 bg-cyan-500 rounded-full'
                              : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-cyan-300 dark:hover:bg-cyan-700'
                          }`}
                          onClick={() => setCurrentStep(step)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
                        <img src="/ailogos.png" alt="AI Logos" className="h-14 w-auto" />
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
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
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
                <img src="/COMPT.png" alt="COMPT Logo" className="h-20 sm:h-24 lg:h-28" />
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
                </div>
                
                 <div>
                   <h5 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Legal</h5>
                   <ul className="space-y-0.5">
                     <li><a href="/legal" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                     <li><a href="/legal" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">Terms of Service</a></li>
                   </ul>
                 </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300 text-xs">
                  © 2025 COMPT. All rights reserved.
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
