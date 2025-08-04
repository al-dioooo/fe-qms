import MainLayout from "@/layouts/main-layout"
import { fetcher } from "@/lib/fetcher"
import "@/styles/globals.css"
import { NextPage } from "next"
import type { AppProps } from "next/app"
import { SWRConfig } from "swr"

import { PagesProgressProvider as ProgressProvider } from "@bprogress/next"
import Toast from "@/components/toast"

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    layout?: (page: React.ReactElement) => React.ReactNode
}

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    // Default layout fallback
    const layout = Component.layout ?? ((page) => <MainLayout title="QC Monitoring System">{page}</MainLayout>)

    return (
        <>
            <SWRConfig value={{ fetcher, shouldRetryOnError: false }}>
                <ProgressProvider color="#3B82F6">
                    {layout(<Component {...pageProps} />)}
                </ProgressProvider>
            </SWRConfig>
            <Toast />
        </>
    )
}
