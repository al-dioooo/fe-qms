export default function Topbar({ title }: { title?: string }) {
    return (
        <div className="py-4 m-2">
            <h1 className="text-2xl py-2 font-semibold text-transparent bg-clip-text bg-gradient-to-tr from-blue-500 to-blue-300">{title}</h1>
        </div>
    )
}