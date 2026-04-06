"use client"

import { useTheme } from "@/components/providers/theme-provider"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"
import { GoogleGenerativeAI } from "@google/generative-ai" // [1] Import SDK
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

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // [2] Initialize the SDK with your key
      // Use your key ending in ...pitc (the newest one)
      const genAI = new GoogleGenerativeAI("AIzaSyC5eWRrAX0hHWpr69Qf0JaAxA7HSP4dvwc");
      
      // [3] Use the specific model string that works with the SDK
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // [4] Generate content
      const prompt = `${CITY_CONTEXT}\n\nUser: ${input}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages((prev) => [...prev, { role: "assistant", content: text }])
    } catch (error) {
      console.error("Gemini Error:", error)
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "System error: I cannot reach the Mumbai grid. Please check your API key in the code." 
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-up h-[calc(100vh-120px)] flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className={cn("w-6 h-6", emergencyMode ? "text-red-500" : "text-primary")} />
            AI Assistant
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Mumbai Metropolis Companion</p>
        </div>
        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">
          <MapPin className="w-3 h-3" /> Mumbai Central
        </span>
      </div>

      {/* Chat UI */}
      <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden border-muted/20">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex w-full gap-4", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg", msg.role === "assistant" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                {msg.role === "assistant" ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={cn("max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap", msg.role === "assistant" ? "bg-secondary/30 text-foreground rounded-tl-none" : "bg-primary text-primary-foreground rounded-tr-none")}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />}
        </div>

        {/* Input */}
        <div className="p-4 bg-black/20 border-t border-white/5">
          <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about Mumbai..."
              className="flex-1 bg-secondary/50 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </GlassCard>
    </div>
  )
}