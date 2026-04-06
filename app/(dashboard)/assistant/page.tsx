"use client"

import { useTheme } from "@/components/providers/theme-provider"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"
import {
  Bot,
  Loader2,
  MapPin,
  MessageSquare,
  Send,
  Sparkles,
  User
} from "lucide-react"
import * as React from "react"

// Constants for Mumbai context
const CITY_CONTEXT = "You are the Mumbai City 2035 AI Assistant. You help citizens with real-time info about Mumbai weather, AQI, traffic, and urban planning. Keep responses helpful, concise, and professional. Use local references like 'Western Express Highway', 'BKC', or 'Marine Drive' when relevant."

export default function AssistantPage() {
  const { emergencyMode } = useTheme()
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [messages, setMessages] = React.useState([
    {
      role: "assistant",
      content: "Namaste! I'm your Mumbai City Assistant. How can I help you navigate the city today?",
    },
  ])

  const scrollRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try { 
      // Replace with your actual API endpoint or direct SDK call
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCLy3OZevkHKbq4slopcCq4k5FdENRyW-s`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${CITY_CONTEXT}\n\nUser: ${input}` }] }],
        }),
      })
      const data = await response.json()
      const aiResponse = data.candidates[0].content.parts[0].text

      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting to the city grid. Please try again later." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-up h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className={cn(
              "w-6 h-6",
              emergencyMode ? "text-emergency" : "text-primary"
            )} />
            AI Assistant
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Intelligent urban companion for Mumbai Metropolis
          </p>
        </div>
        <div className="flex gap-2">
           <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">
             <MapPin className="w-3 h-3" /> Mumbai Central
           </span>
        </div>
      </div>

      {/* Main Chat Interface */}
      <GlassCard className={cn(
        "flex-1 flex flex-col p-0 overflow-hidden border-muted/20",
        emergencyMode && "border-emergency/30"
      )}>
        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-muted"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex w-full gap-4 animate-fade-in",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg",
                msg.role === "assistant" 
                  ? "bg-primary/20 text-primary border border-primary/30" 
                  : "bg-muted text-muted-foreground border border-muted-foreground/20"
              )}>
                {msg.role === "assistant" ? <Bot size={18} /> : <User size={18} />}
              </div>
              
              <div className={cn(
                "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === "assistant" 
                  ? "bg-secondary/30 text-foreground rounded-tl-none border border-white/5" 
                  : "bg-primary text-primary-foreground rounded-tr-none"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 items-center">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Loader2 size={18} className="animate-spin text-primary" />
              </div>
              <div className="bg-secondary/30 p-4 rounded-2xl rounded-tl-none border border-white/5">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/20 border-t border-white/5">
          <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about traffic in Dadar, AQI, or utilities..."
                className="w-full bg-secondary/50 border border-white/10 rounded-xl py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
              />
              <MessageSquare className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={cn(
                "p-3 rounded-xl transition-all",
                isLoading || !input.trim() 
                  ? "bg-muted text-muted-foreground cursor-not-allowed" 
                  : "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20"
              )}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
          <div className="mt-2 flex gap-4 px-2">
            <button 
              onClick={() => setInput("What is the current AQI in Bandra?")}
              className="text-[10px] text-muted-foreground hover:text-primary transition-colors"
            >
              • Bandra AQI?
            </button>
            <button 
              onClick={() => setInput("Show me smart routes to BKC.")}
              className="text-[10px] text-muted-foreground hover:text-primary transition-colors"
            >
              • Routes to BKC
            </button>
            <button 
              onClick={() => setInput("Water supply status for Worli?")}
              className="text-[10px] text-muted-foreground hover:text-primary transition-colors"
            >
              • Worli Water Status
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}