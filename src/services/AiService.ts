import { db } from "@/db/database";
import { useAIStore } from "@/stores/useAiStore";
export interface chatRow {
  id: string;
}
export interface getChatidResult {
  chat_id: string;
}

const AiService = { 


  async  getChatId():Promise<getChatidResult | null> {

   const result = await db.getFirstAsync<chatRow>('SELECT id FROM chats ORDER BY created_at DESC LIMIT 1');
  
  
   if (result) {

     return { chat_id: result.id };
   } else {
     return null as any;
   }

  },

  async sendMessageToGroq(userMessage: string) {
    const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
    const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY; 


  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // fast + good
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    

    return data.choices?.[0]?.message?.content || "No response";
  } catch (error) {
    console.error("Groq error:", error);
    return "Something went wrong.";
  }
    },

  async addMessageToDb(Message:any,type:string){

    if (type  == 'user'){
      
      // 1. Save user message 
      await db.runAsync(
        `INSERT INTO messages (id, chat_id, sender, text, timestamp)
         VALUES (?, ?, ?, ?, ?)`,
        [
          Message.id,      // string
          Message.chat_id, // string
          Message.sender,  // string
          Message.text,    // string (primitive)
          Message.timestamp // number
        ]
      );
    }else{
      
      // 3. Save AI response - FIXED: Pass primitive values  refactor this too
      await db.runAsync(
        `INSERT INTO messages (id, chat_id, sender, text, timestamp)
         VALUES (?, ?, ?, ?, ?)`,
        [
          Message.id,
          Message.chat_id,
          Message.sender,
          Message.text,    // string (primitive)
          Message.timestamp
        ]
      );
    }
  },
  async createNewChat(id:string){
    //refactor id and title
      await db.runAsync(
        `INSERT INTO chats (id, title, created_at, updated_at)
         VALUES (?, ?, ?, ?)`,
        [id, 'New Chat', Date.now(), Date.now()]
      );
  },
  async updateTimeStamp(id:string){
    await db.runAsync(
        `UPDATE chats SET updated_at = ? WHERE id = ?`,
        [Date.now(), id]
      );
  },


  
  async getChatMessages(chatId: string) {
    try {
        const response  = await db.getAllAsync(
          `SELECT id,sender, text, timestamp FROM messages WHERE chat_id = ? ORDER BY timestamp ASC`,
          [chatId]
        )
        useAIStore.getState().setChatHistory(response as any);
        useAIStore.getState().set_chat_id(chatId);
        
                
        return response;

    }catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  },
  async getChatHistory() {
    try {
      
      const response = await db.getAllAsync(
        `SELECT id, title, created_at FROM chats ORDER BY created_at DESC`
      );
      return response;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  },

  async deleteChatHistory(chatId: string) {
    try {
      await db.runAsync(`DELETE FROM chats WHERE id = ?`, [chatId]);
      await db.runAsync(`DELETE FROM messages WHERE chat_id = ?`, [chatId]);
    } catch (error) {
      console.error('Error deleting chat history:', error);
      throw error;
    }
  },
  async deleteAllChatHistory() {
    try {
      await db.runAsync(`DELETE FROM chats`);
      await db.runAsync(`DELETE FROM messages`);
    } catch (error) {
      console.error('Error deleting all chat history:', error);
      throw error;
    }
  },
};

export default AiService;