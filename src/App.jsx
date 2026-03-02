import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ASCII Art
const ASCII_ART = `
███╗   ██╗ ██████╗ ████████╗    ███╗   ██╗██╗   ██╗██╗     
████╗  ██║██╔═══██╗╚══██╔══╝    ████╗  ██║██║   ██║██║     
██╔██╗ ██║██║   ██║   ██║       ██╔██╗ ██║██║   ██║██║     
██║╚██╗██║██║   ██║   ██║       ██║╚██╗██║██║   ██║██║     
██║ ╚████║╚██████╔╝   ██║       ██║ ╚████║╚██████╔╝███████╗
╚═╝  ╚═══╝ ╚═════╝    ╚═╝       ╚═╝  ╚═══╝ ╚═════╝ ╚══════╝
`;

const HIDDEN_DOSSIER = `
╔═══════════════════════════════════════════════════════════╗
║              CLASSIFIED DEVELOPER PROFILE                 ║
║                    [SECURITY BREACH]                      ║
╠═══════════════════════════════════════════════════════════╣
║  Developer: Sergejs Skuratovs                             ║
║  Email:     wkuratov@gmail.com                            ║
║  Telegram:  @wkuratov                                     ║
║  Cat's IG:  @symbakot 🐈                                  ║
╠═══════════════════════════════════════════════════════════╣
║  [This information is property of NOTNULL Industries]     ║
║  [Unauthorized distribution will result in sarcasm]       ║
╚═══════════════════════════════════════════════════════════╝
`;

// Sarcastic responses
const SARCASTIC_RESPONSES = {
  todo: [
    "Oh, another task you'll forget by Monday? Added.",
    "Great. Like your backlog wasn't long enough already.",
    "Sure. I'll remember this so you don't have to.",
    "Task added. I'd wish you luck, but... you know.",
    "Your future self will thank me. You're welcome.",
    "Another masterpiece of procrastination, captured.",
    "Added. But honestly, when will you actually do this?",
    "Task stored. Unlike your attention span.",
    "Sure thing, boss. Anything else while I'm here?",
    "One more thing for you to ignore. Noted.",
  ],
  done: [
    "Wow. You actually finished something? [NOT NULL]",
    "Task marked complete. I'm genuinely surprised.",
    "Look at you, being productive and stuff.",
    "One down, infinity to go. Progress!",
    "Achievement unlocked: Basic Functionality.",
    "Completed. Don't let it go to your head.",
    "Marking as done. The bar was low, but you cleared it.",
    "Done! Your mom would be proud. Probably.",
  ],
  clear: [
    "My memory is cleaner than your code now.",
    "Cleared. Unlike your browser history.",
    "Terminal wiped. Unlike your mistakes.",
    "Fresh start. You'll need it.",
    "Clean slate. Try not to mess it up immediately.",
  ],
  help: [
    "Here are your options. Try not to break anything.",
    "Command list. Read carefully, I don't repeat myself.",
    "Available commands. Use them wisely (or don't).",
  ],
  invalid: [
    "Command not found. Like your debugging skills.",
    "Unknown command. Maybe try 'help' before you hurt yourself?",
    "Nope. That doesn't work here. Or anywhere, probably.",
    "Invalid. Did you even read the manual?",
    "Command rejected. Much like your pull requests.",
    "That's not a thing. Nice try though.",
  ],
  quotes: [
    "'It works on my machine' - Famous last words.",
    "'Temporary' solutions are the most permanent ones.",
    "Debugging: Being the detective in a crime movie where you're also the murderer.",
    "JavaScript: The world's most popular poorly designed language.",
    "Weeks of coding can save you hours of planning.",
    "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
    "There are 10 types of people: those who understand binary and those who don't.",
    "'Clean code' is a myth created by people who don't ship.",
    "Programming is 10% writing code and 90% understanding why it doesn't work.",
    "Legacy code: Code that works but nobody knows why.",
    "Documentation is like sex: when it's good, it's very good; when it's bad, it's better than nothing.",
    "Software is like entropy: hard to grasp, always increasing, never reversible.",
    "The only time you should use 'var' is never.",
    "Framework of the month club member since 2010.",
    "If at first you don't succeed, call it version 1.0.",
  ],
};

// Konami code sequence
const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// Boot sequence messages
const BOOT_MESSAGES = [
  '[OK] Mounting Sarcasm Module...',
  '[OK] Checking User IQ... Result: Undefined',
  '[OK] Initializing NOTNULL_OS v9.9.9...',
  '[OK] Loading Cynical Response Database...',
  '[OK] Calibrating Snark Levels... 100%',
  '[OK] Connecting to Procrastination Network...',
  '[OK] Loading localStorage (your digital mess)...',
  '[OK] Boot sequence complete. Welcome, I guess.',
];

export default function App() {
  const [booted, setBooted] = useState(false);
  const [bootIndex, setBootIndex] = useState(0);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [glitching, setGlitching] = useState(false);
  const [matrixRain, setMatrixRain] = useState(false);
  const [showDossier, setShowDossier] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [rebooting, setRebooting] = useState(false);
  const [konamiIndex, setKonamiIndex] = useState(0);
  
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('notnull-tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch {
        setTasks([]);
      }
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('notnull-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Boot sequence
  useEffect(() => {
    if (bootIndex < BOOT_MESSAGES.length) {
      const timer = setTimeout(() => {
        setBootIndex(prev => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setBooted(true), 800);
      return () => clearTimeout(timer);
    }
  }, [bootIndex]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, bootIndex]);

  // Focus input
  useEffect(() => {
    if (booted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [booted]);

  // Konami code listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (matrixRain || crashed) return;
      
      if (e.key === KONAMI_CODE[konamiIndex]) {
        const nextIndex = konamiIndex + 1;
        setKonamiIndex(nextIndex);
        
        if (nextIndex === KONAMI_CODE.length) {
          triggerMatrixRain();
          setKonamiIndex(0);
        }
      } else {
        setKonamiIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex, matrixRain, crashed]);

  const triggerGlitch = useCallback(() => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 300);
  }, []);

  const triggerMatrixRain = useCallback(() => {
    setMatrixRain(true);
    setTimeout(() => setMatrixRain(false), 5000);
  }, []);

  const triggerCrash = useCallback(() => {
    setCrashed(true);
    setTimeout(() => {
      setRebooting(true);
      setTimeout(() => {
        setCrashed(false);
        setRebooting(false);
        addToHistory('system', 'Stop trying to break reality. Stay NOT NULL.');
      }, 2000);
    }, 2000);
  }, []);

  const getRandomResponse = (type) => {
    const responses = SARCASTIC_RESPONSES[type];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const addToHistory = (type, content) => {
    setHistory(prev => [...prev, { type, content, timestamp: Date.now() }]);
  };

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    
    if (!trimmed) return;

    addToHistory('input', `> ${cmd}`);

    // Hidden triggers
    if (trimmed === 'sudo --whois-god' || trimmed === 'whoami --root') {
      triggerGlitch();
      setShowDossier(true);
      addToHistory('system', '[SECURITY BREACH DETECTED]');
      addToHistory('ascii', HIDDEN_DOSSIER);
      return;
    }

    if (trimmed === 'null') {
      triggerCrash();
      return;
    }

    // Main commands
    const args = trimmed.split(' ');
    const command = args[0];

    switch (command) {
      case 'help':
        addToHistory('system', getRandomResponse('help'));
        addToHistory('output', `
Available commands:
  help              - Show this list (you figured that out, impressive)
  todo "task"       - Add a task you'll probably forget
  ls                - List all your unfinished business
  done [index]      - Mark a task as complete (rarely used)
  clear             - Clear terminal (won't clear your regrets)
  notnull           - Random cynical wisdom
  
Secret commands:
  Try to find them, detective.
        `.trim());
        break;

      case 'todo':
        const taskMatch = cmd.match(/todo\s+["']?(.+?)["']?$/i);
        if (taskMatch) {
          const taskText = taskMatch[1].trim();
          const newTask = { text: taskText, done: false, id: Date.now() };
          setTasks(prev => [...prev, newTask]);
          addToHistory('system', getRandomResponse('todo'));
          addToHistory('output', `Added: "${taskText}" [NULL]`);
        } else {
          addToHistory('error', 'Usage: todo "your task here". Even that seems hard for you.');
        }
        break;

      case 'ls':
        if (tasks.length === 0) {
          addToHistory('system', 'No tasks found. Your life is as empty as this terminal.');
        } else {
          addToHistory('system', 'Current status of your existence:');
          tasks.forEach((task, i) => {
            const status = task.done ? '[NOT NULL]' : '[NULL]';
            addToHistory('output', `  ${i}: ${status} ${task.text}`);
          });
        }
        break;

      case 'done':
        const index = parseInt(args[1]);
        if (isNaN(index) || index < 0 || index >= tasks.length) {
          addToHistory('error', `Invalid index. There are ${tasks.length} tasks. Math is hard, I know.`);
        } else {
          setTasks(prev => {
            const updated = [...prev];
            updated[index].done = true;
            return updated;
          });
          addToHistory('system', getRandomResponse('done'));
        }
        break;

      case 'clear':
        setHistory([]);
        addToHistory('system', getRandomResponse('clear'));
        break;

      case 'notnull':
        addToHistory('system', getRandomResponse('quotes'));
        break;

      case 'exit':
        addToHistory('system', 'Nice try. You can\'t escape your responsibilities that easily.');
        break;

      default:
        triggerGlitch();
        addToHistory('error', getRandomResponse('invalid'));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCommand(input);
    setInput('');
  };

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Crash screen
  if (crashed) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        {rebooting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-terminal-green font-mono text-sm"
          >
            Rebooting NOTNULL_OS...
          </motion.div>
        )}
      </div>
    );
  }

  // Matrix rain effect
  if (matrixRain) {
    return (
      <div className="w-full h-screen bg-black overflow-hidden relative">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-terminal-green font-mono text-xs whitespace-pre"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-100%',
            }}
            animate={{
              top: '100%',
            }}
            transition={{
              duration: 1 + Math.random() * 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {Array.from({ length: 50 }).map(() => 
              String.fromCharCode(0x30A0 + Math.random() * 96)
            ).join('\n')}
          </motion.div>
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-terminal-green font-mono text-2xl font-bold text-glow"
          >
            ENTERING THE MATRIX
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`w-full h-screen bg-terminal-bg overflow-hidden relative crt-flicker ${glitching ? 'glitch-active' : ''}`}
      onClick={handleTerminalClick}
    >
      {/* Scanlines */}
      <div className="scanlines absolute inset-0 pointer-events-none" />
      
      {/* Vignette */}
      <div className="vignette absolute inset-0 pointer-events-none" />

      {/* Main Terminal */}
      <div className="relative z-20 w-full h-full p-4 md:p-8">
        <AnimatePresence mode="wait">
          {!booted ? (
            <motion.div
              key="boot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono text-sm md:text-base"
            >
              {BOOT_MESSAGES.slice(0, bootIndex).map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-terminal-green mb-1"
                >
                  {msg}
                </motion.div>
              ))}
              {bootIndex === BOOT_MESSAGES.length && (
                <motion.pre
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-terminal-green text-glow text-xs md:text-sm mt-4 leading-none"
                >
                  {ASCII_ART}
                </motion.pre>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="terminal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 text-terminal-green-dim text-xs">
                <span>NOTNULL_TERMINAL v9.9.9</span>
                <span>type 'help' if you're lost</span>
              </div>

              {/* Terminal Output */}
              <div 
                ref={terminalRef}
                className="flex-1 overflow-y-auto font-mono text-sm space-y-2 pr-2"
              >
                <motion.pre
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-terminal-green text-glow text-xs leading-none mb-4"
                >
                  {ASCII_ART}
                </motion.pre>

                {history.map((entry, i) => (
                  <motion.div
                    key={entry.timestamp}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`
                      ${entry.type === 'input' ? 'text-terminal-green-dim' : ''}
                      ${entry.type === 'error' ? 'text-red-500' : ''}
                      ${entry.type === 'system' ? 'text-terminal-green text-glow' : ''}
                      ${entry.type === 'output' ? 'text-terminal-green' : ''}
                      ${entry.type === 'ascii' ? 'text-terminal-green text-glow whitespace-pre text-xs' : ''}
                    `}
                  >
                    {entry.content}
                  </motion.div>
                ))}
              </div>

              {/* Input Line */}
              <form onSubmit={handleSubmit} className="mt-4 flex items-center">
                <span className="text-terminal-green mr-2">{'>'}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent text-terminal-green font-mono outline-none"
                  autoComplete="off"
                  autoFocus
                />
                <span className="cursor-blink text-terminal-green">█</span>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
