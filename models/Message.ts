export interface Message {
    id: number
    message: string
    mediaUrl: string
    messageType: MessageType
    senderPhoneNumber: string
    replyToMessageId: number
    chatId: number
}

export interface CreateMessageRequest {
    message: string
    mediaUrl: string
    messageType: MessageType
    senderPhoneNumber: string
    replyToMessageId: number
    chatId: number
}

enum MessageType {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    AUDIO = "AUDIO",
    DOCUMENT = "DOCUMENT",
}