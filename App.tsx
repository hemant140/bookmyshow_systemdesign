
import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  MessageSquare, 
  BookOpen,
  Search,
  ChevronRight,
  Send
} from 'lucide-react';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import SchemaPanel from './components/SchemaPanel';
import { getSystemDesignAdvice } from './services/geminiService';
import { ChatMessage } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'diagram' | 'schemas' | 'approach'>('diagram');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await getSystemDesignAdvice(input, messages);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Error: Failed to connect to Architect AI." }]);
    } finally {
      setLoading(false);
    }
  };

  const approachSteps = [
    { title: "1. Requirement Clarifications", content: "Functional: Search, Select Seat, Booking, Notification. Non-Functional: High Availability, Consistency (No Double Booking), Scale (Millions of users during blockbusters)." },
    { title: "2. High Level Design", content: "Microservices architecture to scale components independently. API Gateway for routing. Microservices communicating via gRPC for performance." },
    { title: "3. Database Choice", content: "PostgreSQL for ACID compliance in bookings. Redis for distributed locking during the 10-minute seat hold window." },
    { title: "4. Scaling Strategy", content: "Horizontal scaling for search services. Read replicas for DB. CDN for movie posters. Kafka for asynchronous notifications." },
    { title: "5. Handling Concurrency", content: "Distributed locking (Redis Redlock) or Optimistic concurrency control (versioning) in DB to prevent two people from booking the same seat." }
  ];

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-[#0f172a] flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Server size={20} className="text-white" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">DesignPro</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('diagram')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'diagram' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'hover:bg-slate-800'}`}
          >
            <Server size={18} />
            <span className="font-medium">System Architecture</span>
          </button>
          <button 
            onClick={() => setActiveTab('schemas')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'schemas' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'hover:bg-slate-800'}`}
          >
            <Database size={18} />
            <span className="font-medium">Data Schemas</span>
          </button>
          <button 
            onClick={() => setActiveTab('approach')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'approach' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'hover:bg-slate-800'}`}
          >
            <BookOpen size={18} />
            <span className="font-medium">Design Approach</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <p className="text-xs text-slate-400 mb-2 font-medium">SYSTEM STATUS</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Architect AI Active</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#020617]">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#0f172a]/50 backdrop-blur-md">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Project</span>
            <ChevronRight size={14} />
            <span className="text-slate-200 font-medium">BookMyShow System Design</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded border border-slate-700 transition-colors">Export Diagram</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'diagram' && (
            <div className="h-full flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">High-Level Architecture</h2>
                  <p className="text-slate-400">Microservices architecture optimized for scalability and ACID compliance.</p>
                </div>
              </div>
              <div className="flex-1 min-h-[500px]">
                <ArchitectureDiagram />
              </div>
            </div>
          )}

          {activeTab === 'schemas' && (
            <div className="space-y-6">
               <div>
                  <h2 className="text-2xl font-bold">Relational Data Model</h2>
                  <p className="text-slate-400">Core database entities and constraints for the transactional engine.</p>
                </div>
                <SchemaPanel />
            </div>
          )}

          {activeTab === 'approach' && (
            <div className="max-w-4xl mx-auto space-y-8 py-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Design Methodology</h2>
                <p className="text-slate-400 text-lg">A systematic approach to architecting a complex real-time booking engine.</p>
              </div>

              <div className="space-y-6">
                {approachSteps.map((step, idx) => (
                  <div key={idx} className="group flex gap-6 p-6 bg-slate-800/40 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600/20 border border-blue-600/40 flex items-center justify-center text-blue-400 font-bold group-hover:scale-110 transition-transform">
                      {idx + 1}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{step.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{step.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* AI Assistant Sidebar */}
      <aside className="w-96 border-l border-slate-800 bg-[#0f172a] flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <MessageSquare size={20} className="text-blue-400" />
          <h2 className="font-bold text-lg">Architect AI</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Search size={32} className="text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-200">Deep Dive into the Design</h3>
                <p className="text-xs text-slate-500 mt-2">Ask about scalability, database locks, Kafka usage, or specific bottlenecks.</p>
              </div>
              <div className="w-full space-y-2">
                {['How to handle double booking?', 'Explain the Redis lock strategy', 'What if the payment fails?'].map((q, i) => (
                  <button 
                    key={i} 
                    onClick={() => setInput(q)}
                    className="w-full text-left text-xs bg-slate-800 hover:bg-slate-700 p-2 rounded border border-slate-700 text-slate-400 transition-colors"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-300 border border-slate-700 rounded-tl-none whitespace-pre-wrap'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700 flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#0f172a]/80">
          <div className="relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask the architect..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="absolute right-2 top-1.5 p-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default App;
