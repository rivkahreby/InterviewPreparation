import React, { useState, useEffect } from 'react';
import { Send, SkipForward, Code, Mic, MicOff, CornerDownLeft, Loader2 } from 'lucide-react';

interface AnswerInputProps {
  onSubmitAnswer: (answer: string) => void;
  onSkipQuestion: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  onSubmitAnswer,
  onSkipQuestion,
  isLoading,
  disabled,
}) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
    }
  }, []);

  const handleSpeechToggle = () => {
    if (!speechSupported) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText(prev => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isLoading || disabled) return;
    onSubmitAnswer(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInsertCodeSnippet = () => {
    const template = `\n\`\`\`javascript\n// Type your code here\nfunction example() {\n  return true;\n}\n\`\`\`\n`;
    setText(prev => prev + template);
  };

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-3 rounded-b-2xl">
      {/* Editor Helper Bar */}
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleInsertCodeSnippet}
            disabled={disabled || isLoading}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-indigo-500" />
            <span>+ Code Block</span>
          </button>

          {speechSupported && (
            <button
              type="button"
              onClick={handleSpeechToggle}
              disabled={disabled || isLoading}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                isListening
                  ? 'bg-rose-500/10 text-rose-600 border-rose-500/30 animate-pulse'
                  : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-indigo-500" />}
              <span>{isListening ? 'Listening...' : 'Voice Dictation'}</span>
            </button>
          )}
        </div>

        <span className="hidden sm:inline-block text-[11px] font-sans">
          Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 font-mono">Enter</kbd> to submit
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative rounded-xl border border-zinc-300 dark:border-zinc-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 bg-zinc-50/50 dark:bg-zinc-900/60 overflow-hidden transition-all">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your technical response here or insert code blocks... (e.g. Explain core mechanics, memory, code snippets)"
            rows={4}
            disabled={disabled || isLoading}
            className="w-full p-3.5 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none resize-y min-h-[100px] font-sans"
          />

          <div className="px-3 py-1.5 bg-zinc-100/60 dark:bg-zinc-900 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between text-[11px] text-zinc-400">
            <span>{text.trim() ? `${text.trim().split(/\s+/).length} words` : '0 words'}</span>
            <span>{text.length} chars</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={onSkipQuestion}
            disabled={disabled || isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Skip Question</span>
          </button>

          <button
            type="submit"
            disabled={!text.trim() || isLoading || disabled}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <span>Submit Answer</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
