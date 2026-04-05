import { db } from "@/db/database";
import { useAIStore } from "@/stores/useAiStore";
export interface chatRow {
  id: string;
}
export interface getChatidResult {
  chat_id: string;
}
const AiService = {

    async sendMessage({ chatId, message }: { chatId: string; message: string }) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: message }],
                }),
            }); 
            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }
            const data = await response.json();
            const aiReply = data.choices[0].message.content;
            return aiReply;
        } catch (error) {
            console.error('Error sending message to AI:', error);
            throw error;
        }
    },

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