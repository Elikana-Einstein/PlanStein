import { generateUUID, getCurrentTimestamp } from '@/shared/utils';
import { db } from '../db/database';
import { Chat, Message, Attachment, MessageInput } from '../shared/types';
import * as FileSystem from 'expo-file-system';

export const ChatService = {
  
 const sendMessage = async(db:any) {
    await db.runasync()
 };

  /**
   * Seed mock data for testing: create two chats with sample messages.
   */
  seedMockData: async (): Promise<void> => {
    // Check if chats already exist to avoid duplicate seeding
    const existing = await db.getAllAsync(`SELECT COUNT(*) as count FROM chats`);
    if (existing[0].count > 0) {
      console.log('Chats already seeded, skipping.');
      return;
    }

    const now = getCurrentTimestamp();

    // Chat 1: the initial conversation from the UI
    const chat1Id = generateUUID();
    await db.runAsync(
      `INSERT INTO chats (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)`,
      [chat1Id, 'Morning check-in', now, now]
    );

    // Messages for chat 1
    const messages1 = [
      {
        id: generateUUID(),
        sender: 'ai',
        text: "Good morning Elikana! You have 5 tasks due today. Your most urgent one is the project proposal. Want me to help you plan your day?",
        timestamp: now - 10 * 60 * 1000, // 10 min ago
        hasAttachment: 0,
      },
      {
        id: generateUUID(),
        sender: 'user',
        text: "Yes please, I'm feeling overwhelmed with everything",
        timestamp: now - 5 * 60 * 1000,
        hasAttachment: 0,
      },
      {
        id: generateUUID(),
        sender: 'ai',
        text: "That's completely normal. Let's tackle this together. Here's a focused plan for today:\n1. Project proposal — do this first, 60 min\n2. Expo Router docs — 30 min after lunch\n3. Grocery run — on your way home\n\nEverything else can wait. Does this feel manageable?",
        timestamp: now - 2 * 60 * 1000,
        hasAttachment: 0,
      },
    ];

    for (const msg of messages1) {
      await db.runAsync(
        `INSERT INTO messages (id, chat_id, sender, text, timestamp, has_attachment, is_deleted)
         VALUES (?, ?, ?, ?, ?, ?, 0)`,
        [msg.id, chat1Id, msg.sender, msg.text, msg.timestamp, msg.hasAttachment]
      );
    }

    // Chat 2: another conversation with file attachment
    const chat2Id = generateUUID();
    await db.runAsync(
      `INSERT INTO chats (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)`,
      [chat2Id, 'Project brainstorming', now - 2 * 24 * 60 * 60 * 1000, now - 2 * 24 * 60 * 60 * 1000] // 2 days ago
    );

    const chat2MsgId = generateUUID();
    await db.runAsync(
      `INSERT INTO messages (id, chat_id, sender, text, timestamp, has_attachment, is_deleted)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [chat2MsgId, chat2Id, 'user', 'I uploaded the draft for feedback.', now - 2 * 24 * 60 * 60 * 1000 + 1000, 1]
    );

    // Simulate an attachment for this message
    const attachmentId = generateUUID();
    await db.runAsync(
      `INSERT INTO attachments (id, message_id, file_name, file_uri, file_type, file_size, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [attachmentId, chat2MsgId, 'project_draft.pdf', 'file:///mock/path/project_draft.pdf', 'application/pdf', 102400, now - 2 * 24 * 60 * 60 * 1000 + 1500]
    );

    const replyId = generateUUID();
    await db.runAsync(
      `INSERT INTO messages (id, chat_id, sender, text, timestamp, has_attachment, is_deleted)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [replyId, chat2Id, 'ai', 'Thanks for the draft! I’ll review it and get back to you soon.', now - 2 * 24 * 60 * 60 * 1000 + 2000, 0]
    );

    console.log('Mock chats seeded successfully');
  },
};

// Helper to copy file to app's directory (optional, ensures file persists)
const copyFileToAppDirectory = async (sourceUri: string, attachmentId: string): Promise<string> => {
  const fileName = sourceUri.split('/').pop() || 'file';
  const destUri = FileSystem.documentDirectory + `attachments/${attachmentId}_${fileName}`;
  const dir = FileSystem.documentDirectory + 'attachments/';
  const dirInfo = await FileSystem.getInfoAsync(dir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  await FileSystem.copyAsync({ from: sourceUri, to: destUri });
  return destUri;
};

// Row mappers (assuming these are defined elsewhere or can be inline)
const mapRowToChat = (row: any): Chat => ({
  id: row.id,
  title: row.title,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapRowToMessage = (row: any): Omit<Message, 'attachments'> => ({
  id: row.id,
  chatId: row.chat_id,
  sender: row.sender,
  text: row.text,
  timestamp: row.timestamp,
  hasAttachment: row.has_attachment === 1,
});

const mapRowToAttachment = (row: any): Attachment => ({
  id: row.id,
  messageId: row.message_id,
  fileName: row.file_name,
  fileUri: row.file_uri,
  fileType: row.file_type,
  fileSize: row.file_size,
  createdAt: row.created_at,
});