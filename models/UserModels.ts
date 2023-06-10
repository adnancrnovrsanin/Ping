export interface User {
    id: number
    displayName: string
    phoneNumber: string
    about: string
    profilePictureUrl: string
    messages: any
    userChats: any
    enabled: boolean
    username: string
    authorities: Authority[]
    accountNonExpired: boolean
    accountNonLocked: boolean
    credentialsNonExpired: boolean
    password: string
}

export interface Authority {
    authority: string
}