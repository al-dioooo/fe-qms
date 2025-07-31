import Input from "@/components/forms/input"
import Label from "@/components/forms/label"
import apiClient from "@/helpers/api-client"
import AuthLayout from "@/layouts/auth-layout"
import { useRouter } from "next/router"
import { useState } from "react"
import toast from "react-hot-toast"

export default function Login() {
    const router = useRouter()

    const [identifier, setIdentifier] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const data = {
            identifier,
            password
        }

        apiClient.post("/login", data).then((response: any) => {
            // Show toast message
            toast.success(response.data.message, {
                id: "submit"
            })

            router.replace("/")
        }).catch((error: any) => {
            // Show toast message
            toast.error(error.response.data.message, {
                ariaProps: {
                    // @ts-ignore
                    superscript: error.response.status
                },
                id: "submit"
            })
        })
    }

    return (
        <AuthLayout title="Login">
            <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
                <h1 className="font-medium text-xl">Login</h1>

                <form action="" onSubmit={submitHandler} className="flex flex-col gap-y-4 bg-white p-6 rounded-xl shadow min-w-lg">
                    <div>
                        <Label value="Username" />
                        <Input placeholder="Type username here" onChange={(e) => setIdentifier(e.target.value)} />
                    </div>

                    <div>
                        <Label value="Password" />
                        <Input type="password" placeholder="Type password here" onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div className="w-full flex flex-col">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-2xl transition">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </AuthLayout>
    )
}