'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Searchbox from '@/components/Searchbox';
import { Sparkles, Database, Code2, Lightbulb, Globe, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const suggestions = [
  { icon: Database, label: 'Analyze Data', sub: 'Process complex datasets', color: 'var(--primary)', bg: 'var(--primary-light)' },
  { icon: Code2, label: 'Code Assistant', sub: 'Debug and optimize code', color: 'var(--secondary)', bg: 'var(--secondary-light)' },
  { icon: Lightbulb, label: 'Creative Ideas', sub: 'Brainstorm solutions', color: 'var(--tertiary)', bg: 'var(--tertiary-light)' },
  { icon: Globe, label: 'Quick Search', sub: 'Find information fast', color: 'var(--quaternary)', bg: 'var(--quaternary-light)' },
];


export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState([]);
  const hasMessages = messages.length > 0;


  const handleSend = async (text) => {
    //Add user message to cha
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);

    // Add empty assistant message 
    setMessages(m => [...m, { role: 'assistant', content: '' }]);

    // Call your /api/chat route
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: next }),
    });

    // Read the stream chunk by chunk
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value);
      const parts = buffer.split('\n\n');
      buffer = parts.pop() || '';

      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith('data: ')) continue;
        const raw = line.slice(6);
        if (raw === '[DONE]') break;

        try {
          const { delta } = JSON.parse(raw);
          if (delta) {
            setMessages(m => {
              const copy = [...m];
              const last = copy[copy.length - 1];
              copy[copy.length - 1] = { ...last, content: last.content + delta };
              return copy;
            });
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }

    // Flush any remaining buffer
    if (buffer.startsWith('data: ')) {
      const raw = buffer.slice(6);
      if (raw !== '[DONE]') {
        try {
          const { delta } = JSON.parse(raw);
          if (delta) {
            setMessages(m => {
              const copy = [...m];
              const last = copy[copy.length - 1];
              copy[copy.length - 1] = { ...last, content: last.content + delta };
              return copy;
            });
          }
        } catch (e) { }
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <div
          className="flex items-center justify-end px-6 shrink-0 border-b border-gray-100 bg-white"
          style={{ minHeight: 52 }}
        >
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors">
            <Clock size={14} />
            Recent threads
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto flex flex-col">

          {/* ── Hero (no messages) ── */}
          {!hasMessages && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">

              {/* Logo */}
              <div className="flex flex-col items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)',
                    boxShadow: '0 4px 24px rgba(99,102,241,0.15)',
                  }}
                >
                  <Sparkles size={28} strokeWidth={1.8} style={{ color: '#6366f1' }} />
                </div>
                <div className="text-center">
                  <h1 className="text-5xl font-bold tracking-tight text-gray-900">
                    Qubit IQ
                  </h1>
                  <p className="text-base text-gray-400 mt-2">Ask anything. Get answers.</p>
                </div>
              </div>

              {/* Search */}
              <Searchbox onSend={handleSend} />

              {/* Suggestion cards */}
              <div className="w-full max-w-2xl grid grid-cols-2 gap-3">
                {suggestions.map(({ icon: Icon, label, sub, color, bg }) => (
                  <button
                    key={label}
                    onClick={() => handleSend(label)}
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-white text-left hover:border-gray-200 hover:shadow-sm transition-all duration-150"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: bg }}
                    >
                      <Icon size={18} strokeWidth={1.8} style={{ color }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Chat thread (has messages) ── */}
          {hasMessages && (
            <div className="flex-1 flex flex-col gap-5 px-6 py-8 max-w-3xl w-full mx-auto">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-sm'
                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky searchbox once chat starts */}
        {hasMessages && (
          <div className="shrink-0 px-6 pb-5 pt-3 bg-gray-50 border-t border-gray-100">
            <div className="max-w-2xl mx-auto">
              <Searchbox onSend={handleSend} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}