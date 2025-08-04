import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import apiClient from '@/helpers/api-client'
import MainLayout from '@/layouts/main-layout'
import PrimaryButton from '@/components/buttons/primary'
import SelectDescription from '@/components/forms/select-description'

type Detail = { id: string; document_parameter_name: string; document_parameter_code: string; value: string; test_parameter_id: string | null }
type Param = { id: string; code: string; name: string }

const MapPage = () => {
    const { query, push } = useRouter()
    const id = Array.isArray(query.id) ? query.id[0] : query.id
    const [details, setDetails] = useState<Detail[]>([])
    const [params, setParams] = useState<Param[]>([])
    const [map, setMap] = useState<Record<string, string>>({})
    useEffect(() => {
        if (!id) return
        apiClient.get(`/technical-document/${id}`).then(r => {
            setDetails(r.data.data.details)
            const init: Record<string, string> = {}
            r.data.data.details.forEach((d: Detail) => { if (d.test_parameter_id) init[d.id] = d.test_parameter_id })
            setMap(init)
        })
        apiClient.get('/test-parameter', { params: { paginate: false } }).then(r => setParams(r.data.data))
    }, [id])
    const save = () => {
        const payload = {
            mappings: Object.entries(map).map(([detail_id, parameter_id]) => ({
                detail_id,
                parameter_id: parameter_id || null,
            })),
        }
        apiClient.put(`/technical-document/${id}/map`, payload).then(() => {
            push('/technical-document')
        })
    }
    return (
        <>
            <h1 className="text-xl font-semibold mb-6">Parameter Mapping</h1>
            <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                <table className="min-w-full divide-y divide-neutral-200 text-sm">
                    <thead className="bg-neutral-50">
                        <tr>
                            <th className="px-4 py-2 text-xs font-medium text-neutral-500 text-left uppercase tracking-widest">Detail</th>
                            <th className="px-4 py-2 text-xs font-medium text-neutral-500 text-left uppercase tracking-widest">Value</th>
                            <th className="px-4 py-2 text-xs font-medium text-neutral-500 text-left uppercase tracking-widest">Parameter</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.map(d => (
                            <tr key={d.id} className="even:bg-neutral-50">
                                <td className="px-4 py-2">{d.document_parameter_name ?? d.document_parameter_code}</td>
                                <td className="px-4 py-2">{d.value ?? '-'}</td>
                                <td className="px-4 py-2">
                                    <SelectDescription error={false} onChange={(value: any) => setMap({ ...map, [d.id]: value })} selection={params} isLoading={false} value={map[d.id]} keyValue={(value) => value.id} title={(value: any) => value.name} description={(value: any) => value.code} placeholder="Select Parameter" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-6 text-right">
                <PrimaryButton as="button" onClick={save}>Save Mapping</PrimaryButton>
            </div>
        </>
    )
}

MapPage.layout = (page: any) => <MainLayout title="Map Parameters">{page}</MainLayout>

export default MapPage