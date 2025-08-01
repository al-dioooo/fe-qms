import PrimaryButton from "@/components/buttons/primary"
import { ChevronRight, ChevronUpDown, Eye } from "@/components/icons/outline"
import { useTechnicalDocument } from "@/hooks/repositories/useTechnicalDocument"
import MainLayout from "@/layouts/main-layout"
import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"

const TechnicalDocument = () => {
    const router = useRouter()

    const { data: technicalDocumentData, isLoading, isError, mutate } = useTechnicalDocument()

    return (
        <>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div></div>
                    <div>
                        <PrimaryButton as={Link} href="/technical-document/upload">Upload Data</PrimaryButton>
                    </div>
                </div>
                <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                    <table className="min-w-full overflow-x-auto divide-y divide-neutral-200">
                        <thead className="bg-neutral-50 rounded-t-3xl">
                            <tr>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    <button className="flex items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500">
                                        <span>Number</span>
                                        <span><ChevronUpDown className="w-4 h-4" strokeWidth={2} /></span>
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    <button className="flex items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500">
                                        <span>Document Type</span>
                                        <span><ChevronUpDown className="w-4 h-4" strokeWidth={2} /></span>
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    <button className="flex items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500">
                                        <span>Type</span>
                                        <span><ChevronUpDown className="w-4 h-4" strokeWidth={2} /></span>
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    <button className="flex items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500">
                                        <span>Uploaded At</span>
                                        <span><ChevronUpDown className="w-4 h-4" strokeWidth={2} /></span>
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    <button className="flex items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500">
                                        <span>Created At</span>
                                        <span><ChevronUpDown className="w-4 h-4" strokeWidth={2} /></span>
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    <button className="flex items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500">
                                        <span>Updated At</span>
                                        <span><ChevronUpDown className="w-4 h-4" strokeWidth={2} /></span>
                                    </button>
                                </th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                            {technicalDocumentData?.data?.length > 0 && technicalDocumentData?.data?.map((row: any) => (
                                <tr key={row.id} onClick={() => router.push(`/order/${row.id}`)} className="cursor-pointer hover:bg-neutral-50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-medium text-neutral-900 whitespace-nowrap">
                                        {row.number}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                        {row.document_type}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                        {row.type}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                        {moment(row.uploaded_at).format('MMMM D, YYYY')}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                        {moment(row.created_at).format('MMMM D, YYYY')}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                        {row.updated_at ? moment(row.updated_at).format('MMMM D, YYYY') : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-right whitespace-nowrap">
                                        <div className="inline-flex items-center space-x-2">
                                            <ChevronRight className="text-neutral-500" />

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
            </div>
        </>
    )
}

TechnicalDocument.layout = (page: React.ReactElement) => {
    return (
        <MainLayout title="Technical Document List">{page}</MainLayout>
    )
}

export default TechnicalDocument