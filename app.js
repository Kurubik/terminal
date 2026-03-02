const { useState, useEffect, useRef, useCallback } = React;
const { motion, AnimatePresence } = window.Motion || {};

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
╚═══════════════════════════════════════════════════════════╝
`;

const SARCASTIC_RESPONSES = {
  todo: [
    "Oh, another task you'll forget by Monday? Added.",
    "Great. Like your backlog wasn't long enough already.",
    "Sure. I'll remember this so you don't have to.",
  ],
  done: [
    "Wow. You actually finished something? [NOT NULL]",
    "Task marked complete. I'm genuinely surprised.",
  ],
  clear: [
    "My memory is cleaner than your code now.",
    "Cleared. Unlike your browser history.",
  ],
  help: [
    "Here are your options. Try not to break anything.",
  ],
  invalid: [
    "Command not found. Like your debugging skills.",
    "Unknown command. Maybe try 'help'?",
  ],
  quotes: [
    "'It works on my machine' - Famous last words.",
    "Debugging: Being the detective in a crime movie where you're also the murderer.",
  ],
};

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const BOOT_MESSAGES = [
  '[OK] Mounting Sarcasm Module...',
  '[OK] Checking User IQ... Result: Undefined',
  '[OK] Initializing NOTNULL_OS v9.9.9...',
  '[OK] Loading Cynical Response Database...',
  '[OK] Boot sequence complete.',
];

function getRandomResponse(type) {
  const responses = SARCASTIC_RESPONSES[type];
  return responses[Math.floor(Math.random() * responses.length)];
}

function App() {
  const [booted, setBooted] = useState(false);
  const [bootIndex, setBootIndex] = useState(0);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [matrixRain, setMatrixRain] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [konamiIndex, setKonamiIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('notnull-tasks');
    if (saved) {
      try { setTasks(JSON.parse(saved)); } catch { setTasks([]); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notnull-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (bootIndex < BOOT_MESSAGES.length) {
      const timer = setTimeout(() => setBootIndex(i => i + 1), 400);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setBooted(true), 800);
    }
  }, [bootIndex]);

  useEffect(() => {
    if (booted && inputRef.current) inputRef.current.focus();
  }, [booted]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (matrixRain || crashed) return;
      if (e.key === KONAMI_CODE[konamiIndex]) {
        const nextIndex = konamiIndex + 1;
        setKonamiIndex(nextIndex);
        if (nextIndex === KONAMI_CODE.length) {
          setMatrixRain(true);
          setTimeout(() => setMatrixRain(false), 5000);
          setKonamiIndex(0);
        }
      } else {
        setKonamiIndex(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex, matrixRain, crashed]);

  const addToHistory = (type, content) => {
    setHistory(prev => [...prev, { type, content, timestamp: Date.now() }]);
  };

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    addToHistory('input', '> ' + cmd);

    if (trimmed === 'sudo --whois-god' || trimmed === 'whoami --root') {
      addToHistory('system', '[SECURITY BREACH DETECTED]');
      addToHistory('ascii', HIDDEN_DOSSIER);
      return;
    }

    if (trimmed === 'null') {
      setCrashed(true);
      setTimeout(() => {
        setCrashed(false);
        addToHistory('system', 'Stop trying to break reality. Stay NOT NULL.');
      }, 4000);
      return;
    }

    const args = trimmed.split(' ');
    const command = args[0];

    switch (command) {
      case 'help':
        addToHistory('system', getRandomResponse('help'));
        addToHistory('output', `Available commands:
  help - Show this list
  todo "task" - Add a task
  ls - List all tasks
  done [index] - Mark complete
  clear - Clear terminal
  notnull - Random wisdom`);
        break;

      case 'todo':
        const match = cmd.match(/todo\s+["']?(.+?)["']?$/i);
        if (match) {
          const task = match[1].trim();
          setTasks(t => [...t, { text: task, done: false, id: Date.now() }]);
          addToHistory('system', getRandomResponse('todo'));
        } else {
          addToHistory('error', 'Usage: todo "task"');
        }
        break;

      case 'ls':
        if (tasks.length === 0) {
          addToHistory('system', 'No tasks found.');
        } else {
          tasks.forEach((t, i) => {
            addToHistory('output', `  ${i}: ${t.done ? '[NOT NULL]' : '[NULL]'} ${t.text}`);
          });
        }
        break;

      case 'done':
        const idx = parseInt(args[1]);
        if (!isNaN(idx) && idx >= 0 && idx < tasks.length) {
          setTasks(t => { const u = [...t]; u[idx].done = true; return u; });
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

      default:
        addToHistory('error', getRandomResponse('invalid'));
    }
  };

  if (crashed) {
    return React.createElement('div', {
      style: { width: '100vw', height: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }
    }, React.createElement('div', { style: { color: '#00ff41', fontFamily: 'monospace' } }, 'Rebooting...'));
  }

  if (matrixRain) {
    return React.createElement('div', {
      style: { width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }
    }, 
      Array.from({ length: 20 }).map((_, i) => 
        React.createElement('div', {
          key: i,
          style: {
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            color: '#00ff41',
            fontFamily: 'monospace',
            fontSize: '12px',
            animation: 'rain 2s linear infinite'
          }
        }, Array.from({ length: 30 }).map(() => String.fromCharCode(0x30A0 + Math.random() * 96)).join('\n'))
      ),
      React.createElement('div', {
        style: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }
      }, React.createElement('div', { style: { color: '#00ff41', fontSize: '24px', fontWeight: 'bold' } }, 'ENTERING THE MATRIX'))
    );
  }

  return React.createElement('div', {
    className: 'crt-flicker',
    style: { width: '100vw', height: '100vh', background: '#050505', position: 'relative', overflow: 'hidden' }
  },
    React.createElement('div', { className: 'scanlines', style: { position: 'absolute', inset: 0 } }),
    React.createElement('div', { className: 'vignette', style: { position: 'absolute', inset: 0 } }),
    React.createElement('div', { style: { position: 'relative', zIndex: 20, padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' } },
      !booted ? 
        React.createElement('div', { style: { fontFamily: 'monospace', whiteSpace: 'pre' } },
          BOOT_MESSAGES.slice(0, bootIndex).join('\n'),
          bootIndex === BOOT_MESSAGES.length ? '\n\n' + ASCII_ART : ''
        ) :
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', opacity: 0.7, fontSize: '12px' } },
            React.createElement('span', null, 'NOTNULL_TERMINAL v9.9.9'),
            React.createElement('span', null, "type 'help' if you're lost")
          ),
          React.createElement('div', { style: { flex: 1, overflowY: 'auto', fontFamily: 'monospace' } },
            React.createElement('pre', { style: { color: '#00ff41', marginBottom: '20px', lineHeight: 1 } }, ASCII_ART),
            history.map((entry, i) => React.createElement('div', {
              key: entry.timestamp || i,
              style: {
                color: entry.type === 'error' ? '#ff4444' : entry.type === 'system' ? '#00ff41' : '#00aa2a',
                marginBottom: '5px',
                whiteSpace: 'pre'
              }
            }, entry.content))
          ),
          React.createElement('form', {
            onSubmit: (e) => { e.preventDefault(); handleCommand(input); setInput(''); },
            style: { display: 'flex', marginTop: '10px' }
          },
            React.createElement('span', { style: { color: '#00ff41', marginRight: '10px' } }, '>'),
            React.createElement('input', {
              ref: inputRef,
              value: input,
              onChange: (e) => setInput(e.target.value),
              style: { background: 'transparent', border: 'none', color: '#00ff41', fontFamily: 'monospace', flex: 1, outline: 'none' },
              autoFocus: true
            }),
            React.createElement('span', { style: { color: '#00ff41', animation: 'blink 1s step-end infinite' } }, '█')
          )
        )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
