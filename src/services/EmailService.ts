import { emails as fallbackEmails } from '@/shared/utils/dummy';

const GMAIL_LIST_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=INBOX&maxResults=20';
const GMAIL_MESSAGE_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const SUMMARY_MODEL = 'llama-3.1-8b-instant';

let accessToken: string | null = null;

export interface EmailItem {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  body?: string;
  priority: 'Urgent' | 'Normal' | 'Low';
  timestamp: string;
  isRead: boolean;
  hasAttachment: boolean;
}

function normalizePriority(priority?: string): 'Urgent' | 'Normal' | 'Low' {
  if (!priority) return 'Normal';
  const value = priority.toString().toLowerCase();
  if (value.includes('urgent') || value.includes('high') || value.includes('important')) return 'Urgent';
  if (value.includes('low') || value.includes('later')) return 'Low';
  return 'Normal';
}

function getHeader(headers: any[], name: string): string | undefined {
  return headers?.find((header: any) => header.name?.toLowerCase() === name.toLowerCase())?.value;
}

function mapGmailMessage(raw: any): EmailItem {
  const headers = raw.payload?.headers ?? [];
  const subject = getHeader(headers, 'Subject') || 'No subject';
  const from = getHeader(headers, 'From') || 'Unknown sender';
  const date = getHeader(headers, 'Date') || 'Unknown';

  const senderMatch = from.match(/^(.*?)(?:\s+<.*>)?$/);
  const sender = senderMatch ? senderMatch[1].trim() : from;
  const senderEmailMatch = from.match(/<(.+?)>/);
  const senderEmail = senderEmailMatch ? senderEmailMatch[1] : from;

  return {
    id: raw.id,
    sender,
    senderEmail,
    subject,
    preview: raw.snippet || 'No preview available.',
    body: raw.snippet || undefined,
    priority: normalizePriority(raw.labelIds?.join(' ') || ''),
    timestamp: date,
    isRead: !(raw.labelIds ?? []).includes('UNREAD') ? true : false,
    hasAttachment: (raw.payload?.parts ?? []).some((part: any) => part.filename && part.filename.length > 0),
  };
}

async function summarizeText(text: string): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  if (!apiKey) {
    return text.slice(0, 160).trim() + '...';
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: SUMMARY_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an email summarization assistant. Create a concise plain-text preview of the email body.',
          },
          {
            role: 'user',
            content: `Summarize this email into one or two short sentences for an inbox preview. Do not include bullet points or any extra commentary.\n\n${text}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 120,
      }),
    });

    if (!response.ok) {
      throw new Error(`GROQ summarization failed ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content?.trim();
    return result ? result : text.slice(0, 160).trim() + '...';
  } catch (error) {
    console.error('Email summary error:', error);
    return text.slice(0, 160).trim() + '...';
  }
}

async function buildPreview(raw: any): Promise<string> {
  if (raw.snippet && raw.snippet.toString().trim().length > 0) {
    return raw.snippet.toString();
  }

  const text = raw.body || raw.text || raw.summary || raw.html || raw.snippet;
  if (!text) return 'No preview available.';

  const normalized = text.toString().replace(/\s+/g, ' ').trim();
  return normalized.length <= 180 ? normalized : await summarizeText(normalized);
}

async function fetchGmailMessages(): Promise<any[]> {
  if (!accessToken) throw new Error('No Google access token available.');

  const listResponse = await fetch(GMAIL_LIST_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!listResponse.ok) {
    throw new Error(`Gmail list request failed ${listResponse.status}`);
  }

  const listData = await listResponse.json();
  const messages = Array.isArray(listData.messages) ? listData.messages : [];

  const emailDetails = await Promise.all(messages.map(async (message: any) => {
    const detailResponse = await fetch(`${GMAIL_MESSAGE_URL}/${message.id}?format=full`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!detailResponse.ok) {
      throw new Error(`Gmail message request failed ${detailResponse.status}`);
    }
    return await detailResponse.json();
  }));

  return emailDetails;
}

async function mapGmailListToItems(rawEmails: any[]): Promise<EmailItem[]> {
  return await Promise.all(rawEmails.map(async (raw) => {
    const email = mapGmailMessage(raw);
    if (!email.preview || email.preview.length < 20) {
      email.preview = await buildPreview(raw);
    }
    return email;
  }));
}

export const EmailService = {
  setAccessToken(token: string) {
    accessToken = token;
  },

  clearAccessToken() {
    accessToken = null;
  },

  async fetchEmails(): Promise<EmailItem[]> {
    if (!accessToken) {
      return fallbackEmails.map((raw) => ({
        id: String(raw.id),
        sender: raw.sender,
        senderEmail: raw.senderEmail,
        subject: raw.subject,
        preview: raw.preview,
        body: undefined,
        priority: normalizePriority(raw.priority),
        timestamp: raw.timestamp,
        isRead: Boolean(raw.isRead),
        hasAttachment: Boolean(raw.hasAttachment),
      }));
    }

    try {
      const rawEmails = await fetchGmailMessages();
      const mapped = await mapGmailListToItems(rawEmails);
      return mapped.length ? mapped : fallbackEmails.map((raw) => ({
        id: String(raw.id),
        sender: raw.sender,
        senderEmail: raw.senderEmail,
        subject: raw.subject,
        preview: raw.preview,
        body: undefined,
        priority: normalizePriority(raw.priority),
        timestamp: raw.timestamp,
        isRead: Boolean(raw.isRead),
        hasAttachment: Boolean(raw.hasAttachment),
      }));
    } catch (error) {
      console.error('Error fetching Gmail emails:', error);
      return fallbackEmails.map((raw) => ({
        id: String(raw.id),
        sender: raw.sender,
        senderEmail: raw.senderEmail,
        subject: raw.subject,
        preview: raw.preview,
        body: undefined,
        priority: normalizePriority(raw.priority),
        timestamp: raw.timestamp,
        isRead: Boolean(raw.isRead),
        hasAttachment: Boolean(raw.hasAttachment),
      }));
    }
  },
};