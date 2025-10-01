"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Volume2, VolumeX, Mic, MicOff } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatPanelProps {
  onSpeak?: (text: string) => void;
}

export default function ChatPanel({ onSpeak }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Chess Teacher. Ask me anything about chess - openings, tactics, endgames, or any position you're curious about!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Opening questions
    if (message.includes('opening') || message.includes('start')) {
      return "Great question! Openings are the first 10-15 moves of a chess game. Key principles include: 1) Control the center with pawns, 2) Develop your knights and bishops, 3) Castle early for king safety, 4) Don't move the same piece twice in the opening, and 5) Don't bring out the queen too early. Popular openings include the Italian Game, Spanish Opening, and Sicilian Defense.";
    }
    
    // Tactics questions
    if (message.includes('tactic') || message.includes('fork') || message.includes('pin')) {
      return "Tactics are short-term combinations that win material or deliver checkmate. Common tactics include: Forks (attacking two pieces at once), Pins (immobilizing a piece), Skewers (attacking a valuable piece to expose a less valuable one), and Discovered attacks. Practice tactics daily to improve your tactical vision!";
    }
    
    // Endgame questions
    if (message.includes('endgame') || message.includes('end game')) {
      return "The endgame is the final phase when few pieces remain. Key concepts include: King activity (the king becomes a powerful piece), Pawn promotion, Opposition (controlling key squares with your king), and Basic checkmates like King and Queen vs King. Study endgames to convert winning positions!";
    }
    
    // Strategy questions
    if (message.includes('strategy') || message.includes('position')) {
      return "Chess strategy involves long-term planning. Key elements include: Piece activity (active pieces are more valuable), Pawn structure (weak pawns can be targets), King safety, Space advantage, and Material balance. Always ask: 'What is my opponent's plan?' and 'What is the worst-placed piece?'";
    }
    
    // Checkmate patterns
    if (message.includes('checkmate') || message.includes('mate')) {
      return "Checkmate patterns are beautiful! Common ones include: Scholar's Mate (4-move checkmate), Back Rank Mate (trapping the king behind pawns), Smothered Mate (king surrounded by own pieces), and Anastasia's Mate. Learning patterns helps you spot opportunities!";
    }
    
    // General chess advice
    if (message.includes('improve') || message.includes('better') || message.includes('learn')) {
      return "To improve at chess: 1) Play regularly, 2) Study tactics daily (puzzles), 3) Analyze your games, 4) Learn opening principles (not memorization), 5) Study endgames, 6) Watch strong players, and 7) Be patient - improvement takes time!";
    }
    
    // Piece values
    if (message.includes('value') || message.includes('worth') || message.includes('point')) {
      return "Piece values help with exchanges: Pawn = 1, Knight = 3, Bishop = 3, Rook = 5, Queen = 9, King = priceless! These are guidelines - sometimes a piece's activity makes it worth more than its material value.";
    }
    
    // Default response
    return "That's an interesting question! Could you be more specific? I can help with openings, tactics, endgames, strategy, checkmate patterns, or general chess improvement. What would you like to know more about?";
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    const response = generateResponse(inputText);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInputText("");
    
    // Auto-speak the response
    setTimeout(() => speak(response), 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 animate-slide-up h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-semibold text-lg">Chess Teacher Chat</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSpeaking(!isSpeaking)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              title={isSpeaking ? "Stop speaking" : "Start speaking"}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <p className="text-sm text-blue-100 mt-1">Ask me anything about chess!</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {!message.isUser && (
                  <button
                    onClick={() => speak(message.text)}
                    className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
                    title="Read aloud"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about chess openings, tactics, endgames..."
              className="w-full p-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
              rows={2}
            />
            <button
              onClick={isListening ? stopListening : startListening}
              className={`absolute right-2 top-2 p-2 rounded-full transition-colors ${
                isListening 
                  ? 'bg-red-500 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          💡 Try asking: "What's the best opening for beginners?" or "Explain the fork tactic"
        </p>
      </div>
    </div>
  );
}
