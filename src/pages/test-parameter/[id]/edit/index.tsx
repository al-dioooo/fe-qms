import MainLayout from "@/layouts/main-layout"
import Form from "./form"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import apiClient from "@/helpers/api-client"

type TP = { id: string; name: string; test_step: number }

const EditTestParameter = () => {
    const router = useRouter()
    const { id } = router.query // expects /test-parameter/edit?id=<uuid>

    const [record, setRecord] = useState<TP | null>(null)
    const [errors, setErrors] = useState<any>({})
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    useEffect(() => {
        if (!id || Array.isArray(id)) return
        setIsLoading(true)
        apiClient
            .get(`/test-parameter/${id}`)
            .then((res) => setRecord(res.data?.data ?? res.data))
            .catch(() =>
                toast.error("Failed to load test parameter", { id: "load-tp" })
            )
            .finally(() => setIsLoading(false))
    }, [id])

    const submitHandler = (data: { name: string; test_step: number }) => {
        if (!id || Array.isArray(id)) return
        setIsSubmitting(true)
        setErrors({})

        apiClient
            .put(`/test-parameter/${id}`, data)
            .then((response) => {
                toast.success(response?.data?.message ?? "Updated", { id: "submit" })
                router.replace("/test-parameter")
            })
            .catch((error) => {
                if (error?.response?.status === 422) {
                    setErrors(error.response.data.errors ?? {})
                }
                toast.error(error?.response?.data?.message ?? "Update failed", {
                    ariaProps: {
                        /* @ts-ignore */
                        superscript: error?.response?.status
                    },
                    id: "submit",
                })
            })
            .finally(() => setIsSubmitting(false))
    }

    return (
        <div>
            {/* @ts-ignore */}
            <Form
                onSubmit={submitHandler}
                isLoading={isSubmitting || isLoading}
                errors={errors}
                defaultValues={record ?? undefined}
            />
        </div>
    )
}

EditTestParameter.layout = (page: React.ReactElement) => (
    <MainLayout title="Edit Test Parameter">{page}</MainLayout>
)

export default EditTestParameter