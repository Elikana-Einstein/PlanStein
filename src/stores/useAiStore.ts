import { create }        from 'zustand';
import { DailyBrief, MeStats }    from '../shared/types';
import chat from 'app/(drawer)/chat';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatState {
  chats: Message[];
  chat_id: string;
  addMessage: (message: { role: 'user' | 'assistant'; content: string,timestamp: Date }) => void;
  set_chat_id: (id: string) => void;
  updateChatHistory: (chatId: string, message: Message) => void;
  setChatHistory: (messages: Message[]) => void;
}


export const useAIStore = create<ChatState>((set) => ({
  chats:[],
  chat_id: '',
  set_chat_id: (id: string) => set({ chat_id: id }),
  addMessage:(message: { role: 'user' | 'assistant'; content: string,timestamp: Date }) => set((state) => ({
    chats: [...state.chats, message as Message],
  })),
  updateChatHistory: (chatId: string, message: Message) => set((state) => ({
    chats: [...state.chats, message],
  })),
  setChatHistory: ( messages: Message[]) => set({ chats: messages }),
  


}));