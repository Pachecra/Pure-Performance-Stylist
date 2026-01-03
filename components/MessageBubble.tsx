import React from 'react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import { User, Zap } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in-up`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center border ${isUser ? 'bg-gray-100 border-gray-200' : 'bg-brand-black border-brand-black'}`}>
          {isUser ? <User className="w-4 h-4 text-brand-black" /> : <Zap className="w-4 h-4 text-white fill-white" />}
        </div>

        {/* Bubble Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`px-5 py-4 shadow-sm relative overflow-hidden text-sm leading-relaxed ${
              isUser
                ? 'bg-brand-black text-white rounded-2xl rounded-tr-sm'
                : 'bg-brand-gray text-brand-black rounded-2xl rounded-tl-sm'
            }`}
          >
            {/* Attached Image */}
            {message.image && (
              <div className="mb-3 rounded overflow-hidden border border-gray-200 bg-white p-1 max-w-[200px]">
                <img src={message.image} alt="Uploaded style" className="w-full h-auto object-cover" />
              </div>
            )}

            {/* Text Content */}
            <div className={`prose prose-sm max-w-none ${!isUser ? 'prose-headings:font-black prose-headings:italic prose-strong:text-transparent prose-strong:bg-clip-text prose-strong:bg-brand-gradient prose-strong:font-black' : 'prose-invert'}`}>
               {message.isLoading ? (
                  <div className="flex gap-1.5 items-center h-5 opacity-70">
                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-150"></span>
                  </div>
               ) : (
                <ReactMarkdown
                  components={{
                    strong: ({node, ...props}) => <span className="font-bold text-brand-black" {...props} />, // Override strong to be black unless styled via prose
                    ul: ({node, ...props}) => <ul className="list-none space-y-1 my-2 pl-0" {...props} />,
                    li: ({node, ...props}) => (
                      <li className="flex gap-2 items-start" {...props}>
                        <span className="text-brand-black font-bold mt-1.5 text-[10px]">›</span>
                        <span>{props.children}</span>
                      </li>
                    ),
                  }}
                >
                  {message.text}
                </ReactMarkdown>
               )}
            </div>
          </div>
          
          {/* Label */}
          <span className="text-[9px] text-gray-400 mt-1.5 font-bold uppercase tracking-wider">
            {isUser ? 'YOU' : 'STYLIST'}
          </span>
        </div>
      </div>
    </div>
  );
};