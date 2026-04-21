import { db } from "@/db/database";
import { Message } from "@/shared/types";
import { estimateMessagesTokens, generateUUID, stripThinkingBlock } from "@/shared/utils";
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

  async sendMessageToGroq(userMessage: string, chatId: string): Promise<string> {
  const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
  const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  const model = useAIStore.getState().model;

  const TOKEN_THRESHOLD = 2000;  // summarise when old messages exceed this
  const RECENT_WINDOW   = 10;    // always keep last 10 messages verbatim

  // 1. load full history from sqlite
  const allMessages = await AiService.getChatMessages(chatId) as {
    id: string; sender: string; text: string; timestamp: number;
  }[];

  // 2. shape into groq format
  const formatted = allMessages.map(m => ({
    id: m.id,
    role: m.sender === 'user' ? 'user' : 'assistant' as 'user' | 'assistant',
    content: m.text,
  }));

  // 3. split into old and recent
  const recentMessages = formatted.slice(-RECENT_WINDOW);
  const oldMessages    = formatted.slice(0, -RECENT_WINDOW);

  // 4. check if old messages need summarising
  let summaryContent = await AiService.getChatSummary(chatId);

  if (oldMessages.length > 0) {
    const oldTokens = estimateMessagesTokens(oldMessages);

    if (oldTokens > TOKEN_THRESHOLD) {
      // summarise old messages, folding in any existing summary
      summaryContent = await AiService.summariseMessages(
        summaryContent,
        oldMessages
      );

      // persist the new summary
      const lastOldMessage = oldMessages[oldMessages.length - 1];
      await AiService.saveChatSummary(chatId, summaryContent, lastOldMessage.id);
    }
  }

  // 5. build final messages payload
  const systemPrompt = {
    role: 'system' as const,
    content: `You are a helpful assistant.${
      summaryContent
        ? `\n\nContext from earlier in this conversation:\n${summaryContent}`
        : ''
    }`,
  };

  const payload = [
    systemPrompt,
    ...recentMessages.map(({ role, content }) => ({ role, content })),
    { role: 'user' as const, content: userMessage },
  ];

  // 6. send to groq
  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: model.id,
        messages: payload,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const raw =  data.choices?.[0]?.message?.content ?? "No response";
    return stripThinkingBlock(raw);
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
      const response = await db.getAllAsync(
        `SELECT id,sender, text, timestamp FROM messages WHERE chat_id = ? ORDER BY timestamp ASC`,
        [chatId]
      );
      return response as any;
    } catch (error) {
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

  async generateChatTitle(userMessage: string): Promise<string> {
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
        model: "llama-3.1-8b-instant", // always use the fast model for this
        messages: [
          {
            role: "system",
            content: "Generate a short 3-4 word title for this conversation. Reply with only the title, no punctuation, no quotes.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 20, // title only needs a few tokens
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "New Chat";
  } catch (error) {
    console.error("Title generation error:", error);
    return "New Chat";
  }
},
async updateChatTitle(chatId: string, title: string): Promise<void> {
  await db.runAsync(
    `UPDATE chats SET title = ? WHERE id = ?`,
    [title, chatId]
  );
},

// fetch existing summary for a chat
async getChatSummary(chatId: string): Promise<string | null> {
  const result = await db.getFirstAsync<{ summary: string }>(
    `SELECT summary FROM chat_summaries WHERE chat_id = ?`,
    [chatId]
  );
  return result?.summary ?? null;
},

// store or update the summary
async saveChatSummary(chatId: string, summary: string, lastMessageId: string): Promise<void> {
  await db.runAsync(
    `INSERT INTO chat_summaries (id, chat_id, summary, up_to_message_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(chat_id) DO UPDATE SET
       summary = excluded.summary,
       up_to_message_id = excluded.up_to_message_id,
       updated_at = excluded.updated_at`,
    [generateUUID(), chatId, summary, lastMessageId, Date.now(), Date.now()]
  );
},

// call groq to summarise old messages
async summariseMessages(
  existingSummary: string | null,
  messagesToSummarise: { role: string; content: string }[]
): Promise<string> {
  const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
  const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

  const previousSummaryBlock = existingSummary
    ? `Previous summary:\n${existingSummary}\n\n`
    : '';

  const messagesText = messagesToSummarise
    .map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`)
    .join('\n');

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // always fast model for utility tasks
        messages: [
          {
            role: "system",
            content: `You are a memory summariser. Summarise the conversation below into a concise paragraph that captures key facts, user preferences, names, decisions, and context. Be dense — every sentence should carry information. Do not include filler.`,
          },
          {
            role: "user",
            content: `${previousSummaryBlock}New messages to incorporate:\n${messagesText}`,
          },
        ],
        temperature: 0.3, // low temp for factual compression
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() ?? existingSummary ?? '';
  } catch (error) {
    console.error("Summarisation error:", error);
    return existingSummary ?? '';
  }
},



};

export default AiService;