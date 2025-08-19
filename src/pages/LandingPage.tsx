import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Terminal, Users, Bot, Check } from 'lucide-react';
import { ArrowDown } from 'lucide-react';
import CreateWorkspace from './CreateWorkspace';
import { TutorialOverlay } from '@/components/TutorialOverlay';

const LandingPage = () => {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [typingComplete, setTypingComplete] = useState(false);
  const [showEnterPrompt, setShowEnterPrompt] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [tutorialVisible, setTutorialVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  // Terminal commands sequence - now with phases
  const terminalPhases = [
    // Phase 0: Problem
    [
      '$ cat current-state.md',
      '',
      'CURRENT STATE:',
      '==============',
      '',
      '• Ideas scattered across Slack, email, notes',
      '• AI conversations happen in isolation',
      '• Team context gets lost between platforms',
      '• Collaboration feels chaotic and inefficient',
      '• Prompts and responses disconnected',
      '',
    ],
    // Phase 1: Clear command only
    [
      '$ clear',
      '', // This will be skipped after clear
    ],
    // Phase 2: Solution 
    [
      '$ cat compt-solution.md',
      '',
      'COMPT SOLUTION:',
      '===============',
      '',
      '• Collaborative Prompting Tool',
      '• ONE workspace for everyone and AI',
      '• Real-time synchronized conversations',
      '• Branch ideas and refine prompts together',
      '• Context preserved across all interactions',
      '• Multiple AI agents working as a team',
      '',
    ],
    // Phase 3: Clear again before demo
    [
      '$ clear',
      '', // This will be skipped after clear
    ],
    // Phase 4: Demo prompt (fresh terminal)
    [
      '$ compt demo --interactive',
      '',
      'Ready to see organized collaboration in action?',
      '',
      'Press ENTER to start interactive demo...',
    ]
  ];

  const [currentPhase, setCurrentPhase] = useState(0);
  const [shouldClear, setShouldClear] = useState(false);

  // Typing animation for terminal with phases
  useEffect(() => {
    if (currentPhase >= terminalPhases.length) {
      setTypingComplete(true);
      setTimeout(() => setShowEnterPrompt(true), 500);
      return;
    }

    let lineIndex = 0;
    let charIndex = 0;
    const typingSpeed = 35;
    const lineDelay = 180;
    const currentCommands = terminalPhases[currentPhase];

    const typeNextCharacter = () => {
      if (lineIndex >= currentCommands.length) {
        // Phase complete, wait then move to next phase
        if (currentPhase === 0) {
          // After problem phase, wait then move to clear phase
          setTimeout(() => {
            setCurrentPhase(1);
          }, 1500);
        } else if (currentPhase === 1) {
          // This is the first clear phase, immediately move to solution
          setCurrentPhase(2);
        } else if (currentPhase === 2) {
          // After solution phase, wait then move to second clear phase
          setTimeout(() => {
            setCurrentPhase(3);
          }, 1500);
        } else if (currentPhase === 3) {
          // This is the second clear phase, immediately move to demo
          setCurrentPhase(4);
        } else {
          // Demo prompt complete (phase 4)
          setTypingComplete(true);
          setTimeout(() => setShowEnterPrompt(true), 500);
        }
        return;
      }

      const currentLine = currentCommands[lineIndex];
      
      // Handle clear command specifically
      if (currentLine === '$ clear') {
        // First show the clear command
        setTerminalLines(prev => [...prev, currentLine]);
        
        // Then after a delay, clear the terminal and continue with next line
        setTimeout(() => {
          setTerminalLines([]); // Clear everything
          lineIndex++;
          charIndex = 0;
          setTimeout(typeNextCharacter, 300); // Short delay then continue
        }, 800);
        return;
      }

      // Skip empty line after clear (it's just for spacing in the array)
      if ((currentPhase === 1 || currentPhase === 3) && lineIndex === 1 && currentLine === '') {
        lineIndex++;
        charIndex = 0;
        setTimeout(typeNextCharacter, 100);
        return;
      }

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

    const timer = setTimeout(typeNextCharacter, currentPhase === 0 ? 1000 : 200);
    return () => clearTimeout(timer);
  }, [currentPhase]);

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
        setTimeout(addLoadingMessage, messageIndex === 2 ? 800 : 400); // Longer pause after command
      } else {
        // Start transition after all messages
        setTimeout(() => {
          console.log('Setting isTransitioning to true...');
          setIsTransitioning(true);
          setTimeout(() => {
            console.log('Setting tutorialVisible to true...');
            setTutorialVisible(true);
          }, 800);
        }, 1000);
      }
    };
    
    setTimeout(addLoadingMessage, 500);
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

  // Voice recording functionality
  useEffect(() => {
    const voiceButton = document.getElementById('voice-button');
    const recordingControls = document.getElementById('recording-controls');
    const recordingIndicator = document.getElementById('recording-indicator');
    
    if (voiceButton) {
      voiceButton.addEventListener('click', () => {
        // Start recording
        voiceButton.style.opacity = '0';
        voiceButton.style.pointerEvents = 'none';
        recordingControls.style.opacity = '1';
        recordingIndicator.style.opacity = '1';
      });
    }
    
    const tickButton = recordingControls?.querySelector('button:first-child');
    const cancelButton = recordingControls?.querySelector('button:last-child');
    
    if (tickButton) {
      tickButton.addEventListener('click', () => {
        // Stop recording and save
        voiceButton.style.opacity = '1';
        voiceButton.style.pointerEvents = 'auto';
        recordingControls.style.opacity = '0';
        recordingIndicator.style.opacity = '0';
        // Here you would handle saving the voice recording
      });
    }
    
    if (cancelButton) {
      cancelButton.addEventListener('click', () => {
        // Cancel recording
        voiceButton.style.opacity = '1';
        voiceButton.style.pointerEvents = 'auto';
        recordingControls.style.opacity = '0';
        recordingIndicator.style.opacity = '0';
        // Here you would handle canceling the voice recording
      });
    }
  }, []);

  return (
    <div className={`bg-background transition-all duration-800 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Header Section */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">COMPT</h1>
              <span className="ml-3 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                Beta
              </span>
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
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              COMPT
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              The workspace where your team and AI actually work together. 
              Stop switching between tools. Start brainstorming.
            </p>
          </div>

          {/* Terminal Demo Section */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
              {/* Terminal Header */}
              <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-400 text-sm font-mono ml-4">Interactive Demo</span>
                  </div>
                  <div className="text-gray-500 text-sm">compt-demo</div>
                </div>
              </div>

              {/* Terminal Content */}
              <div 
                className={`bg-black p-6 h-[500px] overflow-y-auto font-mono text-base leading-relaxed ${
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
      <section id="features" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What is COMPT?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The only workspace that brings your team and AI together in one place. Here's how it compares:
            </p>
          </div>
          
          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Feature</th>
                  <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-bold text-blue-600">COMPT</span>
                    </div>
                  </th>
                  <th className="text-center p-4 font-semibold text-gray-600 dark:text-gray-300">ChatGPT</th>
                  <th className="text-center p-4 font-semibold text-gray-600 dark:text-gray-300">Slack</th>
                  <th className="text-center p-4 font-semibold text-gray-600 dark:text-gray-300">Notion</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">Team + AI Collaboration</td>
                  <td className="p-4 text-center">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center text-gray-400">Solo only</td>
                  <td className="p-4 text-center text-gray-400">Team only</td>
                  <td className="p-4 text-center text-gray-400">Team only</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">Real-time Sync</td>
                  <td className="p-4 text-center">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center text-gray-400">No</td>
                  <td className="p-4 text-center">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">Context Preservation</td>
                  <td className="p-4 text-center">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center text-gray-400">Limited</td>
                  <td className="p-4 text-center text-gray-400">No</td>
                  <td className="p-4 text-center text-gray-400">Manual</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">Multiple AI Agents</td>
                  <td className="p-4 text-center">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center text-gray-400">Single AI</td>
                  <td className="p-4 text-center text-gray-400">No AI</td>
                  <td className="p-4 text-center text-gray-400">No AI</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">Prompt Versioning</td>
                  <td className="p-4 text-center">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center text-gray-400">No</td>
                  <td className="p-4 text-center text-gray-400">No</td>
                  <td className="p-4 text-center text-gray-400">No</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">Branch Conversations</td>
                  <td className="p-4 text-center">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center text-gray-400">No</td>
                  <td className="p-4 text-center text-gray-400">No</td>
                  <td className="p-4 text-center text-gray-400">No</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">Unified Search</td>
                  <td className="p-4 text-center">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center text-gray-400">Chat history only</td>
                  <td className="p-4 text-center text-gray-400">Messages only</td>
                  <td className="p-4 text-center">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-900 dark:text-white">AI Memory Across Sessions</td>
                  <td className="p-4 text-center">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center text-gray-400">Session only</td>
                  <td className="p-4 text-center text-gray-400">No AI</td>
                  <td className="p-4 text-center text-gray-400">No AI</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Help Us Improve COMPT
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Share your challenges/problems and stay updated on our progress
            </p>
          </div>

          {/* Feedback Form */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            {/* Text Input with Voice and Image */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Feedback Form
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">* Required fields</span>
              </div>
              <div className="relative">
                <textarea
                  id="feedback"
                  rows={4}
                  className="w-full px-4 py-3 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  placeholder="Describe how your team currently works with AI tools, what challenges you face, and what you'd like to see in a collaborative AI workspace..."
                ></textarea>
                
                {/* Voice Button */}
                <div className="absolute bottom-3 right-3">
                  {/* Recording State */}
                  <div className="flex items-center space-x-2 opacity-0 transition-opacity duration-200" id="recording-controls">
                    <button className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="w-8 h-8 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Default Voice Button */}
                  <button className="w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors relative" id="voice-button">
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                    {/* Recording Indicator */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse opacity-0 transition-opacity duration-200" id="recording-indicator"></div>
                  </button>
                </div>
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
            <div className="space-y-4 mb-8">
              {/* Waitlist Option */}
              <label htmlFor="waitlist" className="block cursor-pointer">
                <div className="flex items-start space-x-4 p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="checkbox"
                      id="waitlist"
                      className="w-5 h-5 text-gray-600 bg-white border-2 border-gray-300 rounded focus:ring-gray-500 focus:ring-2"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Join the waitlist *</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Be first in line when COMPT launches. Get early access and exclusive updates.
                    </p>
                  </div>
                </div>
              </label>

              {/* Closed Beta Option */}
              <label htmlFor="beta" className="block cursor-pointer">
                <div className="flex items-start space-x-4 p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="checkbox"
                      id="beta"
                      className="w-5 h-5 text-gray-600 bg-white border-2 border-gray-300 rounded focus:ring-gray-500 focus:ring-2"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Beta testing</h3>
                      <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium">
                        Limited spots
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Help shape COMPT by testing features before anyone else. Only 100 spots available.
                    </p>
                  </div>
                </div>
              </label>

              {/* Email Consent */}
              <label htmlFor="emails" className="block cursor-pointer">
                <div className="flex items-start space-x-4 p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="checkbox"
                      id="emails"
                      className="w-5 h-5 text-gray-600 bg-white border-2 border-gray-300 rounded focus:ring-gray-500 focus:ring-2"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email updates *</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Get notified about development progress, launch dates, and exclusive early access opportunities.
                    </p>
                  </div>
                </div>
              </label>
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
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white">COMPT</h4>
                <span className="ml-3 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  Beta
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                Collaborative Prompting Tool for teams who want to move from chaos to clarity 
                in their AI-powered collaboration.
              </p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                onClick={() => window.location.href = '/waitlist'}
              >
                Join Waitlist
              </Button>
            </div>
            
            <div>
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Product</h5>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Features</a></li>
                <li><a href="#demo" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Demo</a></li>
                <li><a href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/changelog" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Resources</h5>
              <ul className="space-y-3">
                <li><a href="/docs" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Documentation</a></li>
                <li><a href="/guides" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Guides</a></li>
                <li><a href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Blog</a></li>
                <li><a href="/support" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                © 2024 COMPT. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
