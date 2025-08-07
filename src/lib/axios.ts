import axios from 'axios'
import https from 'https'
import { parseCookies, destroyCookie } from 'nookies'

const agent = new https.Agent({
    rejectUnauthorized: false // Not secure
})

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    httpsAgent: agent
})

api.interceptors.request.use(config => {
    const { qms_auth_token: token } = parseCookies()
    if (token) config.headers.Authorization = `Bearer ${token}`
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