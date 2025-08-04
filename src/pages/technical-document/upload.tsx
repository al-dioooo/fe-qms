import MainLayout from "@/layouts/main-layout"
import Form from "./form"

import { useRouter } from "next/router"
import { useState } from "react"
import toast from "react-hot-toast"
import apiClient from "@/helpers/api-client"

const UploadTechnicalDocument = () => {
    const router = useRouter()

    const [errors, setErrors] = useState<any>({})
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const submitHandler = (data: any) => {
        setIsSubmitting(true)

        const formData = new FormData()
        formData.append("file_upload", data.file)

        console.log(formData.get("file_upload"))

        apiClient.postForm("/technical-document/upload", formData).then((response) => {
            // Show toast message
            toast.success(response.data.message, {
                id: "submit"
            })

            router.replace(`/technical-document/${response.data.data.id}/map`)
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

UploadTechnicalDocument.layout = (page: React.ReactElement) => {
    return (
        <MainLayout title="Upload Technical Document">{page}</MainLayout>
    )
}

export default UploadTechnicalDocument