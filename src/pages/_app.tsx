import "@/styles/globals.css"
import type { AppProps } from "next/app"

import { PagesProgressProvider as ProgressProvider } from "@bprogress/next"
import Toast from "@/components/toast"

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ProgressProvider color="#3B82F6">
            <Toast />
            <Component {...pageProps} />
        </ProgressProvider>
    )
}
