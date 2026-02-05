import React from 'react';

const SUGGESTED_QUESTIONS = [
  "What are Thong's main skills?",
  'Tell me about his work experience',
  'What projects has he worked on?',
] as const;

interface ChatEmptyStateProps {
  onSelectQuestion: (question: string) => void;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  onSelectQuestion,
}) => (
  <div className="text-center py-8">
    <p className="text-slate-600 text-sm">
      Start a conversation by asking a question!
    </p>
    <div className="mt-4 space-y-2">
      {SUGGESTED_QUESTIONS.map((question) => (
        <button
          key={question}
          onClick={() => onSelectQuestion(question)}
          className="block w-full px-4 py-2 text-sm text-left bg-slate-100 
                   hover:bg-slate-200 rounded-xl transition-colors"
        >
          {question}
        </button>
      ))}
    </div>
  </div>
);
