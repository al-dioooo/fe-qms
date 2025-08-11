import PrimaryButton from "@/components/buttons/primary"
import Input from "@/components/forms/input"
import InputSearch from "@/components/forms/input-search"
import { ChevronRight, ChevronUpDown, Eye, Pencil } from "@/components/icons/outline"
import Pagination from "@/components/pagination"
import { TestParameterData, useTestParameters } from "@/hooks/repositories/useTestParameters"
import { useDebounce } from "@/hooks/useDebounce"
import MainLayout from "@/layouts/main-layout"
import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const TestParameter = () => {
    const router = useRouter()

    const params = {
        ...router.query,
        search: router.query.search ?? "",
        page: Number(router.query.page ?? 1)
    }

    const [search, setSearch] = useState<string>(String(params.search) ?? "")
    const debouncedSearch = useDebounce(search, 500)

    useEffect(() => {
        const query: Record<string, any> = { ...router.query, page: 1 }
        if (debouncedSearch) {
            query.search = debouncedSearch
        } else {
            delete query.search
        }

        router.push({ pathname: router.pathname, query }, undefined, {
            shallow: true
        });
    }, [debouncedSearch])

    const toggleSort = (field: string) => {
        const { order_by, direction, ...rest } = router.query

        // ▸ next direction: ASC → DESC → ASC …
        let nextDir: "asc" | "desc" = "asc"
        if (order_by === field && direction !== "desc") nextDir = "desc"

        router.push(
            {
                pathname: router.pathname,
                query: { ...rest, order_by: field, direction: nextDir, page: 1 }, // reset page
            },
            undefined,
            { shallow: true }
        )
    }

    const { data: testParameterData, isLoading, isError, mutate } = useTestParameters(params)

    return (
        <>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <InputSearch onChange={(e) => setSearch(e.target.value)} placeholder="Search data" />
                    <div>
                        <PrimaryButton as={Link} href="/test-parameter/upload">Upload Data</PrimaryButton>
                    </div>
                </div>
                <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                    <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    <button onClick={() => toggleSort('name')} className="cursor-pointer flex items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500">
                                        <span>Name</span>
                                        <span><ChevronUpDown direction={router.query.order_by === 'name' ? (router.query.direction === 'asc' ? 'up' : 'down') : false} className="w-4 h-4" strokeWidth={2} /></span>
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    <button onClick={() => toggleSort('description')} className="cursor-pointer flex items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500">
                                        <span>Description</span>
                                        <span><ChevronUpDown direction={router.query.order_by === 'description' ? (router.query.direction === 'asc' ? 'up' : 'down') : false} className="w-4 h-4" strokeWidth={2} /></span>
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    <button onClick={() => toggleSort('created_at')} className="cursor-pointer flex items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500">
                                        <span>Created At</span>
                                        <span><ChevronUpDown direction={router.query.order_by === 'created_at' ? (router.query.direction === 'asc' ? 'up' : 'down') : false} className="w-4 h-4" strokeWidth={2} /></span>
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    <button onClick={() => toggleSort('updated_at')} className="cursor-pointer flex items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500">
                                        <span>Updated At</span>
                                        <span><ChevronUpDown direction={router.query.order_by === 'updated_at' ? (router.query.direction === 'asc' ? 'up' : 'down') : false} className="w-4 h-4" strokeWidth={2} /></span>
                                    </button>
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Action</span>
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-neutral-200">
                            {testParameterData?.data?.map((row: TestParameterData) => (
                                <tr key={row.id} onClick={() => router.push(`/test-parameter/${row.id}/edit`)} className="cursor-pointer hover:bg-neutral-50 transition-colors">
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
                                        <div className="inline-flex items-center space-x-2">
                                            <Pencil className="text-neutral-500" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={testParameterData?.links} from={testParameterData?.from} to={testParameterData?.to} total={testParameterData?.total} />
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