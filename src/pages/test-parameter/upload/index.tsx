import MainLayout from "@/layouts/main-layout"
import Form from "./form"

import { useRouter } from "next/router"
import { useState } from "react"
import toast from "react-hot-toast"
import apiClient from "@/helpers/api-client"

const UploadTestParameter = () => {
    const router = useRouter()

    const [errors, setErrors] = useState<any>({})
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const submitHandler = (data: any) => {
        setIsSubmitting(true)

        const formData = new FormData()
        formData.append("file_upload", data.file)

        console.log(formData.get("file_upload"))

        apiClient.postForm("/test-parameter/upload", formData).then((response) => {
            console.log("File uploaded successfully:", response.data)
            setIsSubmitting(false)

            // Show toast message
            toast.success(response.data.message, {
                id: "submit"
            })

            router.replace("/test-parameter")
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
        })

        console.log("File uploaded:", data.file)
    }

    return (
        <div>
            {/* @ts-ignore */}
            <Form onSubmit={submitHandler} isLoading={isSubmitting} errors={errors} />
        </div>
    )
}

UploadTestParameter.layout = (page: React.ReactElement) => {
    return (
        <MainLayout title="Upload Test Parameter">{page}</MainLayout>
    )
}

export default UploadTestParameter