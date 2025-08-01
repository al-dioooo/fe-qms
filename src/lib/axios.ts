import axios from 'axios'
import { parseCookies, destroyCookie } from 'nookies'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use(config => {
    const { auth_token } = parseCookies()
    if (auth_token) config.headers.Authorization = `Bearer ${auth_token}`
    return config
})

api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            destroyCookie(null, 'auth_token')
            // if (typeof window !== 'undefined') window.location.href = '/login'
        }
        return Promise.reject(err)
    },
)

export default api