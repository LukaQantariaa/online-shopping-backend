export interface IRegisterUser {
    username: string,
    email: string,
    password: string,
    is_active: boolean
}

export interface ILoginUser {
    username: string,
    password: string,
    is_active: boolean
}
