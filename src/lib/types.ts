export interface ApiResponse<T = unknown> {
    message: string
    data: T
}

export interface PaginatedResponse<T> {
    data: T[]

    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number

    links: {
        url: string | null
        label: string
        active: boolean
    }[]
}