import { useState, useRef, useEffect } from "react";
import { useSendChat } from "@workspace/api-client-react";
import { MessageSquare, Send, Sparkles, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSearch } from "wouter";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};

export function ChatPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const matchParam = params.get("match");

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "ai",
      content: "Olá! Sou o seu Conselheiro IA Betano Pro. Pergunte-me qualquer coisa sobre as odds atuais, apostas de valor ou estratégias gerais de apostas."
    }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatMutation = useSendChat();
  const autoSentRef = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim() || chatMutation.isPending) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    chatMutation.mutate({ data: { message: text } }, {
      onSuccess: (data) => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: data.response
        }]);
      },
      onError: () => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: "Desculpe, encontrei um erro ao analisar essa solicitação. Por favor, tente novamente."
        }]);
      }
    });
  };

  useEffect(() => {
    if (matchParam && !autoSentRef.current) {
      autoSentRef.current = true;
      let decoded = matchParam;
      try { decoded = decodeURIComponent(matchParam); } catch {}
      setTimeout(() => sendMessage(decoded), 400);
    }
  }, [matchParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
      
      {/* Header */}
      <div className="p-4 border-b border-border bg-secondary/50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display font-bold text-lg leading-tight">Conselheiro IA</h2>
          <p className="text-xs text-success flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Online e Pronto
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
      >
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1
              ${msg.role === "user" ? "bg-muted" : "bg-primary/20"}
            `}>
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-primary" />}
            </div>
            
            <div className={`
              max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line
              ${msg.role === "user" 
                ? "bg-primary text-primary-foreground rounded-tr-sm shadow-md shadow-primary/20" 
                : "bg-secondary border border-border rounded-tl-sm"}
            `}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {chatMutation.isPending && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-secondary border border-border rounded-2xl rounded-tl-sm px-4 py-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Analisando odds...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-background">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte sobre jogos, estratégia EV ou ligas específicas..."
            className="w-full pl-4 pr-14 py-4 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || chatMutation.isPending}
            className="absolute right-2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
