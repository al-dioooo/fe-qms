import { useRouter } from "next/router"
import { useEffect, useLayoutEffect, useState } from "react"

import {
    useTestParameters,
    TestParameterData,
} from "@/hooks/repositories/useTestParameters"
import MainLayout from "@/layouts/main-layout"
import axios from "axios"
import { useOrders } from "@/hooks/repositories/useOrders"
import apiClient from "@/helpers/api-client"
import PrimaryButton from "@/components/buttons/primary"

// ─────────────────────────────────────────────────────────────────────────────
interface TestParameterDetail {
    id: string
    name: string
    unit: string | null
    value: string | null
}

// export const getServerSideProps = async ({ params, req: request }: any) => {
//     const response = await axios.get(`https://api-qms.test/order/${params.id}`, {
//         headers: {
//             cookie: request.headers.cookie ?? ''
//         }
//     })

//     return {
//         props: {
//             data: response.data
//         }
//     }
// }

export default function OrderDetail({ data }: { data: any }) {
    const { query } = useRouter()
    const orderId = Array.isArray(query.id) ? query.id[0] : (query.id ?? "")

    const [orderData, setOrderData] = useState<any>()

    const router = useRouter()

    // Fetch all Test Parameters (each includes its `details` array)
    const { data: parameters, isLoading, isError } = useTestParameters()
    const { data: orders, isLoading: isLoadingOrderData } = useOrders()

    // UI state for the selected parameter ID & the one that’s been submitted
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [activeParam, setActiveParam] = useState<TestParameterData | null>(null)

    useEffect(() => {
        if (!isLoadingOrderData) {
            // @ts-ignore
            setOrderData(orders?.data?.find((o: any) => o.id === orderId))
        }
    }, [orderId, isLoadingOrderData])

    const handleSubmit = () => {
        const param = parameters?.data?.find((p: any) => p.id === selectedId)
        if (param) setActiveParam(param)
    }

    return (
        <MainLayout title={`Order Detail - ${orderId}`}>
            <div className="space-y-8">
                {/* Order Info Card */}
                <div className="bg-neutral-50 border-white border shadow-[0px_5px_20px_rgba(0,0,0,0.10)] rounded-4xl p-6">
                    <h1 className="text-2xl font-semibold mb-2">Order Detail</h1>
                    <p className="text-sm text-neutral-500">
                        Details for order ID <span className="font-medium text-neutral-700">#{orderId}</span>
                    </p>
                </div>

                {/* Test Parameters Card */}
                <div className="bg-neutral-50 border-white border shadow-[0px_5px_20px_rgba(0,0,0,0.10)] rounded-4xl p-6">
                    <h2 className="text-xl font-semibold mb-4">Order Detail</h2>

                    {/* Loading / error states */}
                    {isLoadingOrderData && (
                        <p className="text-sm text-neutral-500">Loading order data</p>
                    )}
                    {isError && (
                        <p className="text-sm text-red-500">Failed to load order data.</p>
                    )}

                    {/* Details view (after submit) */}
                    {orderData && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Products</h3>
                            {orderData?.products.length === 0 && (
                                <p className="text-sm text-neutral-500">This order has no details.</p>
                            )}
                            <ul className="divide-y divide-neutral-200">
                                {orderData?.products.map((d: any) => (
                                    <li key={d.id} className="py-3 flex justify-between items-center text-base text-neutral-700">
                                        <span>{d.name}</span>
                                        <div>
                                            <PrimaryButton as="button" onClick={() => router.push(`/order/${orderId}/test/${d.code}`)}>Test Order</PrimaryButton>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}