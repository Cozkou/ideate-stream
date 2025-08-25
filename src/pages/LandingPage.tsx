import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Terminal, Users, Bot, Check } from 'lucide-react';
import { ArrowDown } from 'lucide-react';
import CreateWorkspace from './CreateWorkspace';
import { TutorialOverlay } from '@/components/TutorialOverlay';

const LandingPage = () => {
  const navigate = useNavigate();
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [typingComplete, setTypingComplete] = useState(false);
  const [showEnterPrompt, setShowEnterPrompt] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [tutorialVisible, setTutorialVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  
  // Hero typing animation sentences
  const heroSentences = [
    'ONE workspace for everyone and AI.',
    'One shared workspace where you, your team, and multiple AI agents collaborate in real time to explore and expand ideas.',
    'Multiple AI agents working as a team',
    'Context preserved across all interactions'
  ];
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [heroTypingComplete, setHeroTypingComplete] = useState(false);
  const [heroText, setHeroText] = useState('');

  // Terminal commands sequence - now with phases
  const terminalPhases = [
    // Phase 0: Tutorial prompt (after 2 seconds)
    [
      'Press ENTER to start tutorial...',
    ]
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

  // Hero typing animation effect
  useEffect(() => {
    const currentSentence = heroSentences[currentSentenceIndex];
    let charIndex = 0;
    const typingSpeed = 50;
    const deleteSpeed = 30;
    const pauseBetweenSentences = 2000;
    const pauseBeforeDelete = 1500;

    const typeNextCharacter = () => {
      if (charIndex <= currentSentence.length) {
        setHeroText(currentSentence.substring(0, charIndex));
        charIndex++;
        setTimeout(typeNextCharacter, typingSpeed);
      } else {
        // Typing complete, wait then start deleting
        setTimeout(() => {
          const deleteCharacter = () => {
            if (charIndex > 0) {
              charIndex--;
              setHeroText(currentSentence.substring(0, charIndex));
              setTimeout(deleteCharacter, deleteSpeed);
            } else {
              // Deletion complete, move to next sentence
              setTimeout(() => {
                setCurrentSentenceIndex((prevIndex) => (prevIndex + 1) % heroSentences.length);
              }, pauseBetweenSentences);
            }
          };
          deleteCharacter();
        }, pauseBeforeDelete);
      }
    };

    typeNextCharacter();
  }, [currentSentenceIndex, heroSentences]);

  // Handle Enter key press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && showEnterPrompt && !isLaunching) {
        console.log('Enter pressed, starting transition...');
        startTransition();
      }
    };

    if (showEnterPrompt) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [showEnterPrompt, isLaunching]);

  // Handle click on terminal to trigger Enter
  const handleTerminalClick = () => {
    if (showEnterPrompt && !isLaunching) {
      console.log('Terminal clicked, starting transition...');
      startTransition();
    }
  };

  // Navigate to workspace creation page
  const navigateToWorkspace = () => {
    navigate('/create', { 
      state: { fromLandingPage: true, startTutorial: true } 
    });
  };

  // Smooth transition function with terminal loading
  const startTransition = () => {
    console.log('Starting transition...');
    setIsLaunching(true);
    
    // Add loading messages to terminal
    const loadingMessages = [
      '$ compt init --workspace=tutorial',
      '',
      'Initializing COMPT workspace...',
      'Loading collaborative environment...',
      'Preparing AI agents...',
      'Setting up real-time sync...',
      'Tutorial ready!',
      '',
      'Launching tutorial interface...'
    ];
    
    let messageIndex = 0;
    const addLoadingMessage = () => {
      if (messageIndex < loadingMessages.length) {
        setTerminalLines(prev => [...prev, loadingMessages[messageIndex]]);
        messageIndex++;
        setTimeout(addLoadingMessage, messageIndex === 2 ? 200 : 100); // Longer pause after command
      } else {
        // Navigate to workspace creation page after all messages
        setTimeout(() => {
          console.log('Navigating to workspace creation page...');
          navigateToWorkspace();
        }, 200);
      }
    };
    
    setTimeout(addLoadingMessage, 100);
  };

  // Show tutorial if visible
  if (tutorialVisible) {
    return (
      <div className="bg-background min-h-screen relative" data-tutorial-section>
        {/* Include TutorialOverlay so the tutorial system works */}
        <TutorialOverlay />
        <CreateWorkspace />
      </div>
    );
  }

  // Interface switching functionality
  useEffect(() => {
    const voiceInterface = document.getElementById('voice-interface');
    const textInterface = document.getElementById('text-interface');
    const switchToTextBtn = document.getElementById('switch-to-text');
    const switchToVoiceBtn = document.getElementById('switch-to-voice');
    const largeMicButton = voiceInterface?.querySelector('button');
    
    // Switch to text view
    if (switchToTextBtn) {
      switchToTextBtn.addEventListener('click', () => {
        voiceInterface.classList.add('hidden');
        textInterface.classList.remove('hidden');
      });
    }
    
    // Switch to voice view
    if (switchToVoiceBtn) {
      switchToVoiceBtn.addEventListener('click', () => {
        textInterface.classList.add('hidden');
        voiceInterface.classList.remove('hidden');
      });
    }
    
    // Large microphone button click (start recording)
    if (largeMicButton) {
      largeMicButton.addEventListener('click', () => {
        // Hide microphone and text
        largeMicButton.style.display = 'none';
        document.getElementById('mic-text').style.display = 'none';
        
        // Show waveform and recording controls
        document.getElementById('waveform').classList.remove('hidden');
        document.getElementById('recording-controls').classList.remove('hidden');
        
        // Here you would start voice recording
        console.log('Starting voice recording...');
      });
    }
    
    // Recording controls
    const cancelButton = document.querySelector('#recording-controls button:first-child');
    const saveButton = document.querySelector('#recording-controls button:last-child');
    
    if (cancelButton) {
      cancelButton.addEventListener('click', () => {
        // Reset to initial state
        largeMicButton.style.display = 'flex';
        document.getElementById('mic-text').style.display = 'block';
        document.getElementById('waveform').classList.add('hidden');
        document.getElementById('recording-controls').classList.add('hidden');
        
        // Here you would cancel the recording
        console.log('Recording cancelled');
      });
    }
    
    if (saveButton) {
      saveButton.addEventListener('click', () => {
        // Reset to initial state
        largeMicButton.style.display = 'flex';
        document.getElementById('mic-text').style.display = 'block';
        document.getElementById('waveform').classList.add('hidden');
        document.getElementById('recording-controls').classList.add('hidden');
        
        // Here you would save the recording
        console.log('Recording saved');
      });
    }
    
    // Toggle functionality
    const containers = ['waitlist-container', 'beta-container', 'emails-container'];
    
    containers.forEach(containerId => {
      const container = document.getElementById(containerId);
      const toggle = document.getElementById(containerId.replace('-container', '-toggle'));
      
      if (container && toggle) {
        container.addEventListener('click', () => {
          const isActive = toggle.classList.contains('bg-green-500');
          const circle = toggle.querySelector('div');
          
          if (isActive) {
            // Turn off (red)
            toggle.classList.remove('bg-green-500');
            toggle.classList.add('bg-red-500');
            circle.style.transform = 'translateX(0)';
          } else {
            // Turn on (green)
            toggle.classList.remove('bg-red-500');
            toggle.classList.add('bg-green-500');
            circle.style.transform = 'translateX(1.5rem)';
          }
          
          // Check if waitlist and email updates are both selected
          checkEmailInputVisibility();
        });
      }
    });
    
    // Function to check if email input should be shown
    const checkEmailInputVisibility = () => {
      const waitlistToggle = document.getElementById('waitlist-toggle');
      const emailsToggle = document.getElementById('emails-toggle');
      const emailContainer = document.getElementById('email-input-container');
      
      if (waitlistToggle && emailsToggle && emailContainer) {
        const waitlistActive = waitlistToggle.classList.contains('bg-green-500');
        const emailsActive = emailsToggle.classList.contains('bg-green-500');
        
        if (waitlistActive && emailsActive) {
          emailContainer.classList.remove('hidden');
        } else {
          emailContainer.classList.add('hidden');
        }
      }
    };
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes waveform-pulse {
            0%, 100% {
              opacity: 0.3;
              transform: scaleY(0.3);
            }
            50% {
              opacity: 1;
              transform: scaleY(1);
            }
          }
        `}
      </style>
      <div className={`bg-background transition-all duration-800 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Header Section */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {/* Left side content can be added here if needed */}
            </div>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-8">
                <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
                <a href="#demo" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Demo</a>
                <a href="#docs" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Docs</a>
              </nav>
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
            className="h-20 sm:h-25"
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

          {/* Terminal Demo Section */}
          <div className="max-w-5xl mx-auto">
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
                  </div>
                  <div className="text-gray-500 text-xs sm:text-sm">compt-demo</div>
                </div>
              </div>

              {/* Terminal Content */}
              <div 
                className={`bg-black p-3 sm:p-4 lg:p-6 h-[300px] sm:h-[400px] lg:h-[500px] overflow-y-auto font-mono text-sm sm:text-base leading-relaxed ${
                  showEnterPrompt ? 'cursor-pointer hover:bg-gray-900 transition-colors' : ''
                }`}
                onClick={handleTerminalClick}
              >
                {terminalLines.map((line, index) => (
                  <div key={index} className="mb-1">
                    <span className={`${
                      line.startsWith('$') ? 'text-emerald-400 font-semibold' :
                      line === 'CURRENT STATE:' || line === 'COMPT SOLUTION:' ? 'text-white font-semibold text-lg' :
                      line === '==============' || line === '===============' ? 'text-gray-500' :
                      line.startsWith('•') && (line.includes('scattered') || line.includes('isolation') || line.includes('lost') || line.includes('chaotic') || line.includes('disconnected')) ? 'text-red-300' :
                      line.startsWith('•') ? 'text-blue-300' :
                      line.includes('Ready to see') ? 'text-yellow-300 font-medium' :
                      line.includes('Press ENTER') ? 'text-cyan-300 font-medium' :
                      line.includes('Initializing') || line.includes('Loading') || line.includes('Preparing') || line.includes('Setting up') || line.includes('Tutorial ready') ? 'text-green-300' :
                      line.includes('Launching tutorial') ? 'text-yellow-300 font-medium' :
                      'text-gray-100'
                    }`}>
                      {line}
                      {index === terminalLines.length - 1 && typingComplete && !showEnterPrompt && !isLaunching && (
                        <span className="animate-pulse bg-emerald-400 w-2 h-4 inline-block ml-1"></span>
                      )}
                    </span>
                  </div>
                ))}
                
                {/* Enhanced Enter prompt */}
                {showEnterPrompt && !isLaunching && (
                  <div className="mt-4">
                    <div className="flex items-center mb-3">
                      <span className="text-emerald-400 font-semibold">$ </span>
                      <span className="animate-pulse bg-cyan-400 w-2 h-4 inline-block ml-1"></span>
                    </div>
                    <div className="text-center mt-6">
                      <div className="inline-flex items-center bg-gray-800 px-4 py-2 rounded-md border border-cyan-500/30 hover:border-cyan-500/50 transition-colors">
                        <span className="text-cyan-400 text-lg mr-2">↵</span>
                        <span className="text-cyan-300">Press ENTER to start demo</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Launch animation */}
                {isLaunching && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-emerald-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-400 mr-3"></div>
                      <span>Loading workspace...</span>
                    </div>
                    <div className="flex items-center text-blue-400">
                      <Check className="w-4 h-4 mr-3" />
                      <span>Preparing demo environment...</span>
                    </div>
                  </div>
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
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 sm:p-4 font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Feature</th>
                  <th className="text-center p-3 sm:p-4 font-semibold text-gray-900 dark:text-white">
                    <div className="flex flex-col items-center">
                      <span className="text-lg sm:text-xl font-bold text-blue-600">COMPT</span>
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
                  <td className="p-3 sm:p-4 font-medium text-gray-900 dark:text-white text-sm sm:text-base">Team + AI Collaboration</td>
                  <td className="p-3 sm:p-4 text-center">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-3 sm:p-4 text-center text-gray-400 text-sm sm:text-base">Solo only</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="p-3 sm:p-4 font-medium text-gray-900 dark:text-white text-sm sm:text-base">Real-time Sync</td>
                  <td className="p-3 sm:p-4 text-center">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-3 sm:p-4 text-center text-gray-400 text-sm sm:text-base">No</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">Context Preservation</td>
                  <td className="p-4 text-center">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center text-gray-400">Limited</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">Multiple AI Agents</td>
                  <td className="p-4 text-center">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center text-gray-400">Single AI</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">Prompt Versioning</td>
                  <td className="p-4 text-center">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center text-gray-400">No</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">Branch Conversations</td>
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Help Us Improve COMPT
            </h3>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 px-4">
              Share your challenges/problems and stay updated on our progress
            </p>
          </div>

          {/* Feedback Form */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
            {/* Feedback Form */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Feedback Form
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">* Required fields</span>
              </div>
              
              {/* Voice Recording Interface (Default) */}
              <div id="voice-interface" className="relative">
                <div className="w-full h-32 sm:h-40 lg:h-48 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center">
                  {/* Large Microphone Icon */}
                  <button className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 mb-3 sm:mb-4" id="large-mic-button">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <p className="text-gray-600 dark:text-gray-400 text-center text-sm sm:text-base" id="mic-text">
                    Click to record your feedback
                  </p>
                  
                  {/* Waveform Animation (Hidden by default) */}
                  <div id="waveform" className="hidden mt-4">
                    <div className="flex items-end justify-center space-x-1 h-12">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-blue-400 rounded-full"
                          style={{
                            height: `${Math.random() * 100}%`,
                            animation: 'waveform-pulse 3s ease-in-out infinite',
                            animationDelay: `${i * 0.15}s`
                          }}
                        ></div>
                      ))}
                    </div>
                    <p className="text-blue-600 dark:text-blue-400 text-center mt-2 font-medium">
                      Recording...
                    </p>
                  </div>
                  
                  {/* Recording Controls (Hidden by default) */}
                  <div id="recording-controls" className="hidden mt-4 flex space-x-4">
                    <button className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Switch to Text Button */}
                <button 
                  id="switch-to-text"
                  className="absolute bottom-3 right-3 px-3 py-1 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Switch to text view
                </button>
              </div>
              
              {/* Text Input Interface (Hidden by default) */}
              <div id="text-interface" className="relative hidden">
                <textarea
                  id="feedback"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  placeholder="Describe how your team currently works with AI tools, what challenges you face, and what you'd like to see in a collaborative AI workspace..."
                ></textarea>
                
                {/* Switch to Voice Button */}
                <button 
                  id="switch-to-voice"
                  className="absolute bottom-3 right-3 px-3 py-1 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Switch to voice view
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Get notified when we launch</span>
              </div>
            </div>

            {/* Signup Options */}
            <div className="space-y-0 mb-8">
              {/* Waitlist Option */}
              <div className="flex items-center justify-between py-3 cursor-pointer border-b border-gray-200 dark:border-gray-700" id="waitlist-container">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Join the waitlist <span className="text-red-500">*</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                    Be first in line when COMPT launches
                  </p>
                </div>
                <div 
                  id="waitlist-toggle"
                  className="relative w-10 h-5 sm:w-12 sm:h-6 bg-red-500 rounded-full transition-colors duration-200 ml-2"
                >
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full transition-transform duration-200 shadow-sm"></div>
                </div>
              </div>

              {/* Closed Beta Option */}
              <div className="flex items-center justify-between py-3 cursor-pointer border-b border-gray-200 dark:border-gray-700" id="beta-container">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Beta testing</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                    Help shape COMPT by testing features
                  </p>
                </div>
                <div 
                  id="beta-toggle"
                  className="relative w-10 h-5 sm:w-12 sm:h-6 bg-red-500 rounded-full transition-colors duration-200 ml-2"
                >
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full transition-transform duration-200 shadow-sm"></div>
                </div>
              </div>

              {/* Email Consent */}
              <div className="flex items-center justify-between py-3 cursor-pointer" id="emails-container">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Email updates <span className="text-red-500">*</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                    Get notified about development progress
                  </p>
                </div>
                <div 
                  id="emails-toggle"
                  className="relative w-10 h-5 sm:w-12 sm:h-6 bg-red-500 rounded-full transition-colors duration-200 ml-2"
                >
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full transition-transform duration-200 shadow-sm"></div>
                </div>
              </div>
              
              {/* Email Input (Hidden by default) */}
              <div id="email-input-container" className="hidden mt-4">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                disabled
              >
                Submit Feedback
              </Button>
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
                className="h-20 sm:h-24 lg:h-28"
              />
              <p className="text-gray-600 dark:text-gray-300 max-w-md text-sm mt-1">
                Coprompting, made accessible.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4 items-center">
              <div>
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Product</h5>
                <ul className="space-y-0.5">
                  <li><a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">Features</a></li>
                  <li><a href="#demo" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">Demo</a></li>
                </ul>
              </div>
              
              <div>
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Contact Us</h5>
                <Button 
                  variant="ghost"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-transparent p-0 font-medium transition-colors text-sm"
                  onClick={() => window.open('https://linkedin.com/company/compt', '_blank')}
                >
                  LinkedIn
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-600 dark:text-gray-300 text-xs">
                © 2025 COMPT. All rights reserved.
              </p>
              <div className="flex space-x-4 mt-1 sm:mt-0">
                <a href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-xs transition-colors">Privacy Policy</a>
                <a href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-xs transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
};

export default LandingPage;
