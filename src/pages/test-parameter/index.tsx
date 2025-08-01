import PrimaryButton from "@/components/buttons/primary"
import { ChevronRight, ChevronUpDown, Eye } from "@/components/icons/outline"
import { TestParameterData, useTestParameters } from "@/hooks/repositories/useTestParameters"
import MainLayout from "@/layouts/main-layout"
import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"

const TestParameter = () => {
    const router = useRouter()

    const { data: testParameterData, isLoading, isError, mutate } = useTestParameters()

    return (
        <>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div></div>
                    <div>
                        <PrimaryButton as={Link} href="/test-parameter/upload">Upload Data</PrimaryButton>
                    </div>
                </div>
                <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                    <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    <button className="flex items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500">
                                        <span>Name</span>
                                        <ChevronUpDown className="w-4 h-4" strokeWidth={2} />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    <button className="flex items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500">
                                        <span>Description</span>
                                        <ChevronUpDown className="w-4 h-4" strokeWidth={2} />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    <button className="flex items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500">
                                        <span>Created At</span>
                                        <ChevronUpDown className="w-4 h-4" strokeWidth={2} />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    <button className="flex items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500">
                                        <span>Updated At</span>
                                        <ChevronUpDown className="w-4 h-4" strokeWidth={2} />
                                    </button>
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Action</span>
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-neutral-200">
                            {testParameterData?.data?.map((row: TestParameterData) => (
                                <tr key={row.id} onClick={() => router.push(`/test-parameter/${row.id}`)} className="cursor-pointer hover:bg-neutral-50 transition-colors">
                                    <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="font-medium text-neutral-900">{row.name}</div>
                                            <div>{row.code}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                        {row.description}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                        {moment(row.created_at).format("MMMM D, YYYY")}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                        {row.updated_at ? moment(row.updated_at).format("MMMM D, YYYY") : "-"}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-right whitespace-nowrap">
                                        {/* <Eye
                                    className="inline-block text-neutral-500 w-5 h-5"
                                // onClick={(e) => {
                                //     e.stopPropagation();
                                //     router.push(`/test-template/${row.id}`);
                                // }}
                                /> */}
                                        <div className="inline-flex items-center space-x-2">
                                            <ChevronRight className="text-neutral-500" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

TestParameter.layout = (page: React.ReactElement) => {
    return (
        <MainLayout title="Test Parameter List">{page}</MainLayout>
    )
}

export default TestParameter