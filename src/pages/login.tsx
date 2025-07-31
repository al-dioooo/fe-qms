import Input from "@/components/forms/input"
import Label from "@/components/forms/label"
import AuthLayout from "@/layouts/auth-layout"

export default function Login() {
    return (
        <AuthLayout title="Login">
            <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
                <h1 className="font-medium text-xl">Login</h1>

                <form action="" className="flex flex-col gap-y-4 bg-white p-6 rounded-xl shadow min-w-lg">
                    <div>
                        <Label value="Username" />
                        <Input placeholder="Type username here" onChange={() => { }} />
                    </div>

                    <div>
                        <Label value="Password" />
                        <Input type="password" placeholder="Type password here" onChange={() => { }} />
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