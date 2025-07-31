import Sidebar from "@/components/partials/sidebar"
import Topbar from "@/components/partials/topbar"

const routes = [
    { href: "/", label: "Dashboard" },
    { href: "/order", label: "Order" },
    { href: "/test-parameter", label: "Test Parameter" },
    { href: "/test-parameter/create", label: "Create Test Parameter" },
    { href: "/certificate", label: "Certificate" },
    { href: "/report", label: "Report" },

    { href: "/input-qc", label: "Input QC" },
    { href: "/input-qc/order", label: "Input QC by Order" },
    { href: "/input-qc/parameter", label: "Input QC by Parameter" }
]

export default function MainLayout({ children, title }: { children: React.ReactNode, title?: string }) {
    return (
        <div className="flex max-w-screen">
            <Sidebar />
            <main className="p-4 flex-grow">
                <Topbar title={title} />
                <div className="p-2 w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}