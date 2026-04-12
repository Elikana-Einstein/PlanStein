import { create }        from 'zustand';
import { DailyBrief, MeStats }    from '../shared/types';
import AiService from '@/services/AiService';
import { MODELS } from '@/shared/constants/models';

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
  model: {id:string,label:string,description:string};
  chat_history:Chat[],
  addMessage: (message: { role: 'user' | 'assistant'; content: string,timestamp: Date }) => void;
  set_chat_id: (id: string) => void;
  set_model: (id: string) => void;
  updateChatHistory: (chatId: string, message: Message) => void;
  setChatHistory: (messages: Message[]) => void;
 // setChatTitleHistory: (titles: Chat[]) => void;
 fetchChatHistroy: ()=>Promise<void>;
}


export const useAIStore = create<ChatState>((set,get) => ({
  chats:[],
  model:MODELS[0],
  chat_id: '',
  chat_history:[],
  set_chat_id: (id: string) => set({ chat_id: id }),
  set_model: (name:any) => set({ model: name }),
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