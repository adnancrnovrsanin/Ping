export interface UserChat {
    id: number
    chat: Chat
    userPhoneNumber: string
    didUpdateLast: boolean
    creator: boolean
    admin: boolean
}

export interface CreateUserChatRequest {

}

export interface Chat {
    id: number
    chatName?: string
    chatImageUrl: string
    chatDescription: string
    chatType: string
    memberPhoneNumbers: string[]
    createdAt?: string
    updatedAt?: string
}

export interface CreateChatRequest {
    id: number
    chatName?: string
    chatImageUrl: string
    chatDescription: string
    chatType: string
    memberPhoneNumbers: string[]
    createdAt?: string
    updatedAt?: string
}