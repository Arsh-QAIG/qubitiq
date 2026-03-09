'use client';

import { useState, useRef } from 'react';
import { Paperclip, Mic, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Searchbox({ onSend }) {
  const [query,   setQuery]   = useState('');
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);
  const hasQuery = query.trim().length > 0;

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  };

  const handleSend = () => {
    if (!hasQuery) return;
    onSend?.(query.trim());
    setQuery('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  return (
    <div
      className={cn(
        'w-full max-w-2xl rounded-2xl border bg-white transition-all duration-200',
        focused
          ? 'border-indigo-300 shadow-lg'
          : 'border-gray-200 shadow-md hover:border-gray-300'
      )}
    >
      <div className="flex items-end gap-2 px-4 py-3">
        {/* Attach */}
        <button
          tabIndex={-1}
          className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors mb-0.5"
        >
          <Paperclip size={16} strokeWidth={1.8} />
        </button>

        {/* Input */}
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); autoResize(); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask anything..."
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none leading-relaxed text-base text-gray-800 placeholder-gray-400 py-0.5"
          style={{ minHeight: 28, maxHeight: 160 }}
        />

        {/* Mic */}
        <button
          tabIndex={-1}
          className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors mb-0.5"
        >
          <Mic size={16} strokeWidth={1.8} />
        </button>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={!hasQuery}
          className={cn(
            'w-9 h-9 shrink-0 flex items-center justify-center rounded-xl transition-all duration-200 mb-0.5',
            hasQuery
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md cursor-pointer'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          )}
        >
          <ArrowUp size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}