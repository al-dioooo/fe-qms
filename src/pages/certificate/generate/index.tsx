import MainLayout from "@/layouts/main-layout"
import Form from "./form"

import { useRouter } from "next/router"
import { useState } from "react"
import toast from "react-hot-toast"
import apiClient from "@/helpers/api-client"

const GenerateCertificate = () => {
    const router = useRouter()

    const [errors, setErrors] = useState<any>({})
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const submitHandler = (data: any) => {
        setIsSubmitting(true)

        apiClient.post("/certificate/generate", data).then((response) => {
            // Show toast message
            toast.success(response.data.message, {
                id: "submit"
            })

            router.replace("/certificate")
        }).catch((error) => {
            // Assign validation message
            if (error.response.status === 422) {
                setErrors(error.response.data.errors)
            }

            // Show toast message
            toast.error(error.response.data.message, {
                ariaProps: {
                    // @ts-ignore
                    superscript: error.response.status
                },
                id: "submit"
            })
        }).finally(() => setIsSubmitting(false))

        console.log("File uploaded:", data.file)
    }

    return (
        <div>
            {/* @ts-ignore */}
            <Form onSubmit={submitHandler} isLoading={isSubmitting} errors={errors} />
        </div>
    )
}

GenerateCertificate.layout = (page: React.ReactElement) => {
    return (
        <MainLayout title="Generate Certificate">{page}</MainLayout>
    )
}

export default GenerateCertificate