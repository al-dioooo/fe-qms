import Meta from "@/components/meta"

const AuthLayout = ({ children, title, overrideTitle }: { children: React.ReactNode, title?: string, overrideTitle?: boolean }) => {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "QC Monitoring System"

    return (
        <>
            <Meta title={overrideTitle ? (title ?? appName) : ((title ?? appName) + ' — ' + appName)} />
            <div className="flex flex-col justify-center items-center min-h-screen bg-neutral-50">
                <main>
                    {children}
                </main>
            </div>
        </>
    )
}

export default AuthLayout