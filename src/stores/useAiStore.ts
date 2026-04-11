import { create }        from 'zustand';
import { DailyBrief, MeStats }    from '../shared/types';
import chat from 'app/(drawer)/chat';
import AiService from '@/services/AiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Chat {
  id: string,
  title: string
}

interface ChatState {
  chats: Message[];
  chat_id: string;
  chat_history:Chat[],
  addMessage: (message: { role: 'user' | 'assistant'; content: string,timestamp: Date }) => void;
  set_chat_id: (id: string) => void;
  updateChatHistory: (chatId: string, message: Message) => void;
  setChatHistory: (messages: Message[]) => void;
 // setChatTitleHistory: (titles: Chat[]) => void;
 fetchChatHistroy: ()=>Promise<void>;
}


export const useAIStore = create<ChatState>((set,get) => ({
  chats:[],
  chat_id: '',
  chat_history:[],
  set_chat_id: (id: string) => set({ chat_id: id }),
  addMessage:(message: { role: 'user' | 'assistant'; content: string,timestamp: Date }) => set((state) => ({
    chats: [...state.chats, message as Message],
  })),
  updateChatHistory: (chatId: string, message: Message) => set((state) => ({
    chats: [...state.chats, message],
  })),
  setChatHistory: ( messages: Message[]) => set({ chats: messages }),
  //setChatTitleHistory: ( titles: Chat[]) => set({ chat_history: titles }),
  fetchChatHistroy:async()=>{
     const history = await AiService.getChatHistory() as Chat[];
      set({ chat_history: history });
  },
  


}));