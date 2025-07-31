export default function AuthLayout({ children, title }: { children: React.ReactNode, title?: string }) {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-neutral-50">
            <main>
                {children}
            </main>
        </div>
    )
}