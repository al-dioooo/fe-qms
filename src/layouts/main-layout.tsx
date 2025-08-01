import Meta from "@/components/meta"
import Sidebar from "@/components/partials/sidebar"
import Topbar from "@/components/partials/topbar"

const MainLayout = ({ children, title, overrideTitle }: { children: React.ReactNode, title?: string, overrideTitle?: boolean }) => {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "QC Monitoring System"

    return (
        <>
            <Meta title={overrideTitle ? (title ?? appName) : ((title ?? appName) + ' — ' + appName)} />
            <div className="flex max-w-screen">
                <Sidebar />
                <main className="p-4 flex-grow">
                    <Topbar title={title} />
                    <div className="p-2 w-full">
                        {children}
                    </div>
                </main>
            </div>
        </>
    )
}

export default MainLayout