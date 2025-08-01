import api from '@/lib/axios'
import { ApiResponse } from '@/lib/types'

export const fetcher = <T>(
    url: string,
    params?: Record<string, unknown>,
) => api.get<ApiResponse<T>>(url, { params }).then(r => r.data.data)
