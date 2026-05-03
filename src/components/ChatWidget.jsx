import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ExternalLink } from 'lucide-react';
import { matchFAQ, callClaudeAPI, sanitizeInput } from '../utils/apiHelper';

const DEMO_QUESTIONS = [
  'What is NOTA?',
  'Can I vote without Voter ID?',
  'How does the EVM work?',
  'What if I\'m working on voting day?',
  'When will results be announced?',
];

const FALLBACK_LINKS = [
  { label: 'Election Commission of India', url: 'https://eci.gov.in' },
  { label: 'Voter Registration Portal', url: 'https://voters.eci.gov.in' },
  { label: 'Electoral Search', url: 'https://electoralsearch.eci.gov.in' },
  { label: 'Voter Helpline: 1950', url: 'tel:1950' },
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        AI
      </div>
      <div className="bg-blue-50 border border-blue-100 px-4 py-3 rounded-2xl rounded-bl-none">
        <div className="flex gap-1.5 items-center h-4">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message }) {
  const isBot = message.role === 'bot';
  return (
    <div className={`flex items-end gap-2 mb-3 chat-message ${isBot ? '' : 'flex-row-reverse'}`}>
      {isBot && (
        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-0.5">
          AI
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isBot
            ? 'bg-blue-50 border border-blue-100 text-gray-800 rounded-bl-none'
            : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none'
        }`}
      >
        {message.text}
        {message.links && (
          <div className="mt-3 space-y-1.5 pt-3 border-t border-blue-200">
            <p className="text-xs font-semibold text-gray-500 mb-2">Helpful Resources:</p>
            {message.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-blue-600 text-xs hover:underline font-medium"
              >
                <ExternalLink size={11} /> {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatWidget({ forceOpen = false, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: "Hi! I'm your VoteFlow AI election assistant. Ask me anything about voting in India — registration, booths, EVMs, NOTA, and more! 🗳️",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [cooldown, setCooldown] = useState(0); // Seconds remaining
  const [lastCallTime, setLastCallTime] = useState(0);
  const [hasApiKey] = useState(() => !!import.meta.env.VITE_ANTHROPIC_API_KEY);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);
  const cooldownInterval = useRef(null);

  // Sync with parent's forceOpen prop (e.g. "Ask Anything" card on Home)
  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      onClose?.();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      cooldownInterval.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(cooldownInterval.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(cooldownInterval.current);
  }, [cooldown]);

  const addMessage = (role, text, links = null) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role, text, links },
    ]);
  };

  const handleSend = async () => {
    const raw = input.trim();
    if (!raw || isTyping || cooldown > 0) return;

    const userText = sanitizeInput(raw).slice(0, 300);
    if (!userText) return;

    setInput('');
    addMessage('user', userText);
    
    // Check if FAQ matches first (doesn't trigger cooldown)
    const faqAnswer = matchFAQ(userText);
    if (faqAnswer) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage('bot', faqAnswer);
      }, 700);
      return;
    }

    // AI API Call (Requires cooldown)
    setIsTyping(true);
    
    const now = Date.now();
    const timeSinceLast = (now - lastCallTime) / 1000;
    
    if (timeSinceLast < 30) {
      setCooldown(Math.ceil(30 - timeSinceLast));
      setIsTyping(false);
      addMessage('bot', `Please wait ${Math.ceil(30 - timeSinceLast)} seconds before asking another AI question. (Rate limit: 1 call per 30s)`);
      return;
    }

    setLastCallTime(now);
    const apiAnswer = await callClaudeAPI(userText);
    setIsTyping(false);
    
    if (apiAnswer) {
      addMessage('bot', apiAnswer);
      setCooldown(30); // Trigger 30s cooldown after successful API call
    } else {
      addMessage(
        'bot',
        "I'm having trouble answering that right now. Here are some official resources that can help:",
        FALLBACK_LINKS,
      );
      setCooldown(10); // Shorter cooldown on failure
    }
  };

  const handleDemoQuestion = (q) => {
    if (isTyping || cooldown > 0) return;
    setInput(q);
    setTimeout(() => {
      handleSend();
    }, 50);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-5 py-3.5 rounded-2xl shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-1 transition-all duration-300 group"
        >
          <MessageCircle size={22} className="group-hover:scale-110 transition-transform" />
          <span className="text-sm">Ask me anything!</span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] sm:w-[400px] max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-slide-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                🗳️
              </div>
              <div>
                <p className="font-bold text-white text-sm">VoteFlow AI Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <p className="text-blue-100 text-xs">
                    {hasApiKey ? 'AI powered · Online' : 'Offline mode · Pre-loaded answers'}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 min-h-0">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Demo Questions */}
          <div className="px-4 py-2 border-t border-gray-100 flex-shrink-0">
            <p className="text-xs text-gray-400 font-semibold mb-2">Quick Questions:</p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {DEMO_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleDemoQuestion(q)}
                  disabled={isTyping || cooldown > 0}
                  className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors font-medium whitespace-nowrap ${
                    isTyping || cooldown > 0 
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 300))}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={cooldown > 0 ? `Wait ${cooldown}s...` : "Ask anything about voting..."}
                className={`flex-1 px-4 py-2.5 border-2 rounded-xl text-sm transition-all ${
                  cooldown > 0 
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white'
                }`}
                disabled={isTyping || cooldown > 0}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping || cooldown > 0}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-md"
              >
                {cooldown > 0 ? <span className="text-xs font-bold">{cooldown}</span> : <Send size={16} />}
              </button>
            </div>
            {cooldown > 0 && (
              <p className="text-[10px] text-orange-500 mt-2 text-center font-semibold animate-pulse">
                Rate Limit Active: AI is resting for {cooldown} seconds...
              </p>
            )}
            {!hasApiKey && cooldown === 0 && (
              <p className="text-xs text-gray-400 mt-2 text-center">
                AI assistant offline. Using pre-loaded election answers.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
