import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { FeedbackCard } from './FeedbackCard';
import { Bot, User, Copy, Check, Terminal } from 'lucide-react';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onCopyText?: (text: string) => void;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message, onCopyText }) => {
  const [copied, setCopied] = useState(false);
  const isInterviewer = message.sender === 'interviewer';
  const isSystem = message.sender === 'system';

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    if (onCopyText) onCopyText('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
          {message.text}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 my-4 ${isInterviewer ? 'justify-start' : 'justify-end'}`}>
      {/* Avatar for Interviewer */}
      {isInterviewer && (
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs border border-indigo-500/30">
          <Bot className="w-4 h-4" />
        </div>
      )}

      {/* Message Content Container */}
      <div className={`max-w-[88%] sm:max-w-[80%] space-y-2`}>
        {/* Sender Name & Timestamp */}
        <div className={`flex items-center gap-2 text-[11px] text-zinc-400 px-1 ${isInterviewer ? 'justify-start' : 'justify-end'}`}>
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            {isInterviewer ? 'Interviewer' : 'You (Candidate)'}
          </span>
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Bubble Box */}
        <div
          className={`p-4 rounded-2xl text-sm leading-relaxed shadow-xs ${
            isInterviewer
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-800 rounded-tl-xs'
              : 'bg-indigo-600 text-white rounded-tr-xs dark:bg-indigo-600'
          }`}
        >
          {/* Question or Message Text */}
          <div className="whitespace-pre-wrap font-sans">
            {message.text}
          </div>

          {/* Optional Embedded Code Snippet */}
          {message.codeSnippet && (
            <div className="mt-3 rounded-lg overflow-hidden border border-zinc-700/60 bg-zinc-950 text-zinc-100 font-mono text-xs">
              <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-[11px]">
                <span className="flex items-center gap-1.5 font-sans font-medium">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  Code Reference
                </span>
                <button
                  onClick={() => handleCopyCode(message.codeSnippet!)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span className="text-[10px]">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 overflow-x-auto text-emerald-300/90 leading-normal">
                <code>{message.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Optional Answer Evaluation Card */}
          {message.evaluation && (
            <FeedbackCard evaluation={message.evaluation} />
          )}
        </div>
      </div>

      {/* Avatar for Candidate */}
      {!isInterviewer && (
        <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0 shadow-xs border border-zinc-700">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
