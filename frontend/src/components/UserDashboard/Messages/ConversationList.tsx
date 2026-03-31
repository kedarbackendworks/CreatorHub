import React from 'react';
import { Search } from 'lucide-react';
import ConversationItem, { Conversation } from './ConversationItem';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  return (
    <div className="bg-[#faf8f5] border-r border-[#e4ded2] flex flex-col h-screen w-[304px] shrink-0">
      <div className="px-[24px] pt-[24px] pb-[16px] shrink-0">
        <h2 className="font-[family-name:var(--font-fjalla)] text-[#1a1a1a] text-[28px] leading-none">
          Your Messages
        </h2>
      </div>

      <div className="mx-[16px] mb-[16px] border border-[#e4ded2] bg-white flex gap-[8px] items-center px-[16px] py-[8px] rounded-[20px] w-auto relative shadow-sm">
          <Search className="w-[16px] h-[16px] text-[#aaa] shrink-0" />
          <input 
            type="text" 
            placeholder="Search conversation" 
            className="font-[family-name:var(--font-figtree)] font-normal text-[13px] bg-transparent outline-none flex-1 text-[#5a5a5a] placeholder:text-[#aaa]"
          />
      </div>
      
      <div className="flex-1 overflow-y-auto flex flex-col">
        {conversations.map((conv) => (
          <ConversationItem 
            key={conv.id}
            conversation={conv}
            isActive={selectedId === conv.id}
            onClick={() => onSelect(conv.id)}
          />
        ))}
      </div>
    </div>
  );
}
