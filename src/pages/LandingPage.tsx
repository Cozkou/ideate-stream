import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Terminal, Users, Bot, Check } from 'lucide-react';
import CreateWorkspace from './CreateWorkspace';
import { TutorialOverlay } from '@/components/TutorialOverlay';

const LandingPage = () => {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [typingComplete, setTypingComplete] = useState(false);
  const [showEnterPrompt, setShowEnterPrompt] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [tutorialVisible, setTutorialVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
              Collaborative Prompting Tool
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Transform scattered conversations into organized, AI-powered collaboration. 
              One workspace where teams and AI agents work together seamlessly to turn ideas into results.
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

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose COMPT?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built for teams who want to move from chaos to clarity in their AI-powered collaboration.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Terminal className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Unified Workspace</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Bring all your conversations, prompts, and AI interactions into one organized space. 
                No more switching between platforms or losing context.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Real-time Collaboration</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Work together with your team and AI agents simultaneously in real-time. 
                See ideas evolve and build on each other's insights instantly.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Bot className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">AI-Powered Insights</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Multiple AI agents provide diverse perspectives and maintain context across conversations. 
                Get better results through collaborative intelligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Transform Your Collaboration?
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of teams already using COMPT to organize their AI-powered workflows.
          </p>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            onClick={() => window.location.href = '/waitlist'}
          >
            Join the Waitlist
          </Button>
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
