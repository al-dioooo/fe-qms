import PrimaryButton from "@/components/buttons/primary"
import InputSearch from "@/components/forms/input-search"
import { CloudDownload, ChevronUpDown } from "@/components/icons/outline"
import Pagination from "@/components/pagination"
import { useCertificates } from "@/hooks/repositories/useCertificates"
import { useDebounce } from "@/hooks/useDebounce"
import MainLayout from "@/layouts/main-layout"
import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const CertificateList = () => {
    const router = useRouter()

    const params = {
        ...router.query,
        search: router.query.search ?? "",
        page: Number(router.query.page ?? 1),
        order_by: router.query.order_by ?? "",
        direction: router.query.direction ?? ""
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

    const { data: certificateData, isLoading, isError, mutate } = useCertificates(params)

    const openInNewTab = (url: string) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    return (
        <>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <InputSearch onChange={(e) => setSearch(e.target.value)} placeholder="Search data" />
                    <div>
                        <PrimaryButton as={Link} href="/certificate/generate">Generate</PrimaryButton>
                    </div>
                </div>
                <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                    <table className="min-w-full overflow-x-auto divide-y divide-neutral-200">
                        <thead className="bg-neutral-50 rounded-t-3xl">
                            <tr>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    <button onClick={() => toggleSort('certificate_number')} className="cursor-pointer flex items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500">
                                        <span>Number</span>
                                        <span><ChevronUpDown direction={router.query.order_by === 'certificate_number' ? (router.query.direction === 'asc' ? 'up' : 'down') : false} className="w-4 h-4" strokeWidth={2} /></span>
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    <button onClick={() => toggleSort('issued_at')} className="cursor-pointer flex items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500">
                                        <span>Issued At</span>
                                        <span><ChevronUpDown direction={router.query.order_by === 'issued_at' ? (router.query.direction === 'asc' ? 'up' : 'down') : false} className="w-4 h-4" strokeWidth={2} /></span>
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
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                            {certificateData?.data?.length > 0 && certificateData?.data?.map((row: any) => (
                                <tr key={row.id} onClick={() => openInNewTab(`${process.env.NEXT_PUBLIC_API_ABSOLUTE_URL}/${row.file}`)} className="cursor-pointer hover:bg-neutral-50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-medium text-neutral-900 whitespace-nowrap">
                                        {row.certificate_number}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                        {moment(row.issued_at).format('MMMM D, YYYY')}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                        {moment(row.created_at).format('MMMM D, YYYY')}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                        {row.updated_at ? moment(row.updated_at).format('MMMM D, YYYY') : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-right whitespace-nowrap">
                                        <div className="inline-flex items-center space-x-2">
                                            <CloudDownload className="text-neutral-500" />

                                            {/* {can('brand.update') && (
                                            <Link to={`${row.id}/edit`} state={{ back: title, from: location?.pathname, transition: 'slide' }} className="inline-flex items-center p-1 text-white transition rounded-full bg-neutral-800 active:hover:scale-90">
                                                <Pencil className="w-6 h-6" />
                                            </Link>
                                        )}

                                        {can('brand.delete') && (
                                            <Delete data={row} onSuccess={() => mutateBrandData()} />
                                        )} */}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={certificateData?.links} from={certificateData?.from} to={certificateData?.to} total={certificateData?.total} />
            </div>
        </>
    )
}

CertificateList.layout = (page: React.ReactElement) => {
    return (
        <MainLayout title="Certificate List">{page}</MainLayout>
    )
}

export default CertificateList