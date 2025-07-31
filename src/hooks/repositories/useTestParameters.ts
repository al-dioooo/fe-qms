import useSWR, { SWRConfiguration } from "swr"
import axios, { AxiosInstance } from "axios"

interface TestParameterItem {
    id: number
    name: string
    description: string | null
    created_at: string
    updated_at: string | null
}

export interface TestParameterData {
    id: number
    name: string
    code: string
    description: string | null
    created_at: string
    updated_at: string | null
}

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://api-qms.test/api",
})

api.interceptors.request.use(
    (config) => {
        const token =
            typeof window !== "undefined" ? localStorage.getItem("token") : "1|kiKJUbImwED9A4RKrXo4HedXQS40Q7e3dOiA61lY79ede466"
        if (token) {
            if (!config.headers) {
                config.headers = {} as import("axios").AxiosRequestHeaders;
            }
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config
    },
    (error) => Promise.reject(error)
)

// 2️⃣  Generic SWR‑compatible fetcher (export for global <SWRConfig> if desired)
export const axiosFetcher = <T = unknown>(url: string) =>
    api.get<{ data: T }>(url).then((res) => res.data.data)

// 3️⃣  Hook – returns typed data plus loading / error helpers
export const useTestParameters = (
    config: SWRConfiguration = {}
) => {
    const { data, error, isValidating, mutate } = useSWR<any>(
        "/test-parameter", // relative to baseURL
        axiosFetcher,
        {
            revalidateOnFocus: false,
            ...config,
        }
    )

    return {
        data: data ?? [],
        isLoading: !error && !data,
        isError: error,
        isValidating,
        mutate,
    } as const
}