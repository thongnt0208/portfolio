import React, { RefObject } from 'react';
import { ChatMessage, TypingIndicator } from '../ChatMessage';
import type { Message } from '../../../types/chat';

interface ChatMessagesListProps {
  messages: Message[];
  isGenerating: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export const ChatMessagesList: React.FC<ChatMessagesListProps> = ({
  messages,
  isGenerating,
  messagesEndRef,
}) => (
  <>
    {messages.map((message) => (
      <ChatMessage key={message.id} message={message} />
    ))}
    {isGenerating && <TypingIndicator />}
    <div ref={messagesEndRef} />
  </>
);
