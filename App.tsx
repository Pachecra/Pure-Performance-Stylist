import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { MessageBubble } from './components/MessageBubble';
import { InputArea } from './components/InputArea';
import { sendMessageToGemini } from './services/geminiService';
import { Message } from './types';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "**PURE PERFORMANCE STYLIST** online.\n\nLass uns deine Performance optimieren. Lade ein Foto hoch oder nenne mir dein Ziel – ich erstelle dir sofort das perfekte Wettkampf-Set."
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = async (text: string, image?: string) => {
    const userMessageId = uuidv4();
    const newUserMessage: Message = {
      id: userMessageId,
      role: 'user',
      text,
      image,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsThinking(true);

    // Create a temporary loading message
    const loadingMessageId = uuidv4();
    setMessages((prev) => [...prev, {
      id: loadingMessageId,
      role: 'model',
      text: '',
      isLoading: true
    }]);

    try {
      const responseText = await sendMessageToGemini(text, image);
      
      // Replace loading message with actual response
      setMessages((prev) => prev.map(msg => 
        msg.id === loadingMessageId 
          ? { ...msg, text: responseText, isLoading: false }
          : msg
      ));
    } catch (error) {
      setMessages((prev) => prev.map(msg => 
        msg.id === loadingMessageId 
          ? { ...msg, text: "Verbindung unterbrochen. Bitte versuche es erneut.", isLoading: false }
          : msg
      ));
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-brand-gradient z-30"></div>

      <div className="z-10 flex flex-col h-full relative max-w-screen-xl mx-auto w-full shadow-2xl shadow-gray-100">
        <Header />
        
        <main className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <div className="max-w-4xl mx-auto">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </main>

        <InputArea onSend={handleSendMessage} disabled={isThinking} />
      </div>
    </div>
  );
}

export default App;