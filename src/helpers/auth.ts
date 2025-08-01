import api from '@/lib/axios'
import { setCookie, destroyCookie } from 'nookies'

const COOKIE_KEY = 'qms_auth_token'

export async function login(identifier: string, password: string) {
    const { data } = await api.post('/login', { identifier, password })
    setCookie(null, COOKIE_KEY, data.token, { path: '/' })
    return data
}

export async function register(
    name: string,
    username: string,
    email: string,
    password: string,
    password_confirmation?: string,
) {
    const { data } = await api.post('/register', {
        name,
        username,
        email,
        password,
        password_confirmation: password_confirmation ?? password,
    })
    setCookie(null, COOKIE_KEY, data.token, { path: '/' })
    return data
}

export async function logout() {
    destroyCookie(null, COOKIE_KEY, { path: '/' })
    return api.post('/logout')
}
