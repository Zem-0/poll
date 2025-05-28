import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from './useChat';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <div
      className={`max-w-xl px-4 py-3 rounded-lg shadow-sm break-words relative
        ${message.role === 'user'
          ? 'bg-blue-600 text-white self-end rounded-br-sm'
          : 'bg-white text-gray-800 self-start rounded-bl-sm border border-gray-200'}
      `}
      style={{ wordBreak: 'break-word' }}
    >
      {message.role === 'assistant' ? (
        <>
          <ReactMarkdown className="prose prose-sm max-w-none text-inherit">
            {message.content || '...'}
          </ReactMarkdown>
          {/* Placeholder for action buttons like Redo, Copy, Bookmark */}
          <div className="mt-2 flex gap-2 text-sm text-gray-500">
            {/* Buttons would go here */}
          </div>
        </>
      ) : (
        <span className="whitespace-pre-wrap text-[16px]">{message.content}</span>
      )}
    </div>
  );
};

export const PlanCard: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="max-w-xl bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-4 self-start">
      <h3 className="text-lg font-semibold text-gray-800">{data.title}</h3>
      <p className="text-gray-600">{data.thought}</p>
      <div className="space-y-3">
        {data.steps.map((step: any, index: number) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-gray-800">{step.title}</h4>
            <ReactMarkdown className="prose prose-sm max-w-none text-gray-600">
              {step.description}
            </ReactMarkdown>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ToolResult: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="max-w-xl bg-white rounded-lg shadow-sm border border-gray-100 p-4 self-start">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-gray-500">Tool:</span>
        <span className="text-sm text-gray-700">{data.tool}</span>
      </div>
      <div className="bg-gray-50 p-3 rounded">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
          {JSON.stringify(data.result, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export const MessageRenderer: React.FC<{ message: Message }> = ({ message }) => {
  switch (message.type) {
    case 'plan':
      return <PlanCard data={message.data} />;
    case 'tool_result':
      return <ToolResult data={message.data} />;
    default:
      return <MessageBubble message={message} />;
  }
}; 