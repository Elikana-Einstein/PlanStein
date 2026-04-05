import { Attachment, Chat, Message } from "@/shared/types";

export function chatRowmaaper(row: Record<string,unknown>): Chat {
    return {
        id: row.id as string,
        title: row.title as string,
        createdAt: row.created_at as number,
        updatedAt: row.updated_at  as number,
        isDeleted: row.is_deleted as boolean,

    };
       

}

type sender = "user" | "ai";

export function messageRowmaaper(row: Record<string,unknown>): Message {
    return {
        id: row.id as string,
        chatId: row.chat_id as string,
        sender: row.sender as sender,
        text: row.created_at as string,
        timestamp: row.updated_at  as number,
        isDeleted: row.is_deleted as boolean,
        hasAttachment:row.has_attachment as boolean,

    };
}

export function attachmentRowMapper(row: Record<string,unknown>): Attachment {
    return {
        id:row.id as string,
        messageId:row.message_id as string,
        fileName:row.file_name as string,
        fileUri:row.file_uri as string,
        createdAt: row.created_at as number
    }
}