import Link from "next/link"
import { useRouter } from "next/router"
import { ChevronRight, InputSpark, SmartHome } from "@/components/icons/outline"
import axios from "axios"

const links = [
    { href: "/", label: "Dashboard" },
    { href: "/order", label: "Order" },
    { href: "/test-parameter", label: "Test Parameter" },
    { href: "/technical-document", label: "Technical Document" },
    { href: "/certificate", label: "Certificate" },
    { href: "/report", label: "Report" }
]

export default function Sidebar() {
    const router = useRouter()

    const login = () => {
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            identifier: 'hello@aliceevr.com',
            password: 'aldio1234'
        }).then((response) => {
            if (response.data) {
                localStorage.setItem('token', response.data.token)
                router.push('/')
            } else {
                console.error('Login failed: No token received')
            }
        })
    }

    return (
        <div className="self-stretch sticky top-0 min-h-screen max-h-screen p-4">
            <div className="min-w-2xs flex flex-col min-h-full bg-neutral-50 border-white border shadow-[0px_5px_20px_rgba(0,0,0,0.10)] rounded-4xl gap-y-4">
                <div className="flex items-center justify-center pl-3 pr-4 py-4 m-2 bg-white rounded-3xl">
                    <h2 className="text-lg font-semibold inline-flex items-center gap-2"><span onClick={() => login()} className="cursor-pointer px-3 py-1 bg-radial-[at_25%_25%] from-blue-500 via-blue-400 to-blue-200 text-white rounded-full">QC</span> Monitoring System</h2>
                </div>

                {/* Links */}
                <div className="grow">
                    <ul className="p-2">
                        {links.map((row) => (
                            <li key={row.href}>
                                <Link href={row.href} className={`${router.pathname === row.href ? 'bg-blue-200 hover:bg-blue-200/50' : 'hover:bg-neutral-200/50'} pl-3 pr-4 py-3 relative rounded-xl transition-colors inline-flex items-center w-full gap-x-4`}>
                                    <div className={`${router.pathname === row.href ? 'from-blue-500 to-blue-300 text-white' : 'from-neutral-200 to-neutral-100 text-neutral-500'} bg-gradient-to-tr rounded-lg p-1`}>
                                        <SmartHome className="w-5 h-5" />
                                    </div>
                                    <span className={`${router.pathname === row.href ? 'text-blue-500' : 'text-neutral-500'} font-medium text-sm`}>{row.label}</span>

                                    <div className="absolute -left-1 inset-y-0 flex items-center justify-center pointer-events-none">
                                        <div className={`${router.pathname === row.href ? 'bg-radial-[at_25%_25%] from-blue-500 to-blue-200' : 'bg-transparent'} w-2 h-2 rounded-full`}></div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="m-4 space-y-8">
                    {/* <Link href="/input-qc" className={`${router.pathname === '/input-qc' ? 'bg-blue-200 hover:bg-blue-200/50' : 'from-blue-500 via-blue-400 to-blue-200 hover:bg-neutral-200/50'} bg-radial-[at_0%_20%] px-3 py-3 relative rounded-full transition-colors inline-flex items-center w-full justify-between`}>
                        <div className="flex items-center gap-x-4">
                            <div className={`${router.pathname === '/input-qc' ? 'from-blue-500 to-blue-300 text-white' : 'from-neutral-100 to-neutral-50 text-blue-500'} bg-gradient-to-tr rounded-full p-1`}>
                                <InputSpark className="w-5 h-5" />
                            </div>
                            <span className={`${router.pathname === '/input-qc' ? 'text-blue-500' : 'text-white'} font-medium text-sm`}>Input QC</span>

                            <div className="absolute -left-1 inset-y-0 flex items-center justify-center pointer-events-none">
                                <div className={`${router.pathname === '/input-qc' ? 'bg-radial-[at_25%_25%] from-blue-500 to-blue-200' : 'bg-transparent'} w-2 h-2 rounded-full`}></div>
                            </div>
                        </div>

                        <div className={`${router.pathname === '/input-qc' ? 'text-blue-500' : 'text-white'}`}>
                            <ChevronRight />
                        </div>
                    </Link> */}
                    <div>
                        <p className="text-xs text-center text-neutral-500">QC Monitoring System App v0.1.3</p>
                    </div>
                </div>
            </div>
        </div>
    )
}