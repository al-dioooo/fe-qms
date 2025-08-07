import { useRouter } from "next/router"
import { useEffect, useLayoutEffect, useState } from "react"

import MainLayout from "@/layouts/main-layout"
import axios from "axios"
import { useOrders } from "@/hooks/repositories/useOrders"
import apiClient from "@/helpers/api-client"
import PrimaryButton from "@/components/buttons/primary"
import api from "@/lib/axios"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"

type PageProps = {
    data: any
}

function titleize(value: string) {
    var words = value.split('-');

    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        words[i] = word.charAt(0).toUpperCase() + word.slice(1);
    }

    return words.join(' ');
}

// export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
//     const { id: orderId } = context.query

//     const response = await apiClient.get(`/order/${orderId}`)
//     const result = response.data?.data

//     return {
//         props: {
//             data: result
//         }
//     }
// }

// const OrderDetail = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
const OrderDetail = () => {
    const { query } = useRouter()
    const orderId = Array.isArray(query.id) ? query.id[0] : (query.id ?? "")

    const [orderData, setOrderData] = useState<any>()

    const router = useRouter()

    const { data: orders, isLoading: isLoadingOrderData, isValidating: isValidatingOrderData, isError } = useOrders({})

    useEffect(() => {
        if (!isLoadingOrderData && !isValidatingOrderData) {
            // @ts-ignore
            setOrderData(orders?.data?.find((o: any) => o.id === orderId))
        }
    }, [orderId, isLoadingOrderData, isValidatingOrderData])

    return (
        <>
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
                                        <div>
                                            <div>{d.name}</div>
                                            <div>
                                                <span className={`${d.pivot?.status === 'tested-fail' ? 'bg-red-200 text-red-500' : (d.pivot?.status === 'tested-pass' ? 'bg-green-200 text-green-500' : 'bg-neutral-200 text-neutral-500')} text-xs uppercase px-3 py-1 rounded-full font-medium`}>{titleize(d.pivot?.status)}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <PrimaryButton as="button" onClick={() => d.pivot?.status === 'open' ? router.push(`/order/${orderId}/test/${d.pivot?.id}`) : router.push(`/order/${orderId}/test/${d.pivot?.id}/result`)}>
                                                {d.pivot?.status === 'open' ? 'Test Order' : 'View Test Result'}
                                            </PrimaryButton>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

OrderDetail.layout = (page: React.ReactElement) => {
    return (
        <MainLayout title="Order Detail">{page}</MainLayout>
    )
}

export default OrderDetail