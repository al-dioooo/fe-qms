import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import apiClient from '@/helpers/api-client'
import MainLayout from '@/layouts/main-layout'

const TOTAL = 6
const spans = (s: number) => { if (!s) return [TOTAL]; const b = Math.floor(TOTAL / s); const r = TOTAL % s; return Array.from({ length: s }, (_, i) => b + (i < r ? 1 : 0)) }
const r2 = (n: number) => Math.round(n * 100) / 100
const eq = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t
const toNum = (v: any) => { const f = parseFloat(String(v).replace(',', '.')); return isFinite(f) ? f : NaN }

type Param = { id: string; name: string; unit: string | null; test_step: number }
type Row = { test_parameter: Param; values: (string | number)[] }
type DocDet = { test_parameter_id: string | null; value: string | null }
type TDInfo = { number: string; version?: number | null; details: DocDet[] }
type Res = { technical_document: TDInfo; details: Row[] }

const Result = () => {
    const { query } = useRouter()
    const orderId = Array.isArray(query.id) ? query.id[0] : query.id
    const detailId = Array.isArray(query['detail-id']) ? query['detail-id'][0] : query['detail-id']

    const [data, setData] = useState<Res | null>(null)
    useEffect(() => {
        if (!detailId) return
        apiClient.get(`/qc-inspection/by/order/${detailId}`).then(r => setData(r.data.data))
    }, [detailId])

    const spec = useMemo(() => {
        const m: Record<string, string> = {}
        if (!data) return m
        data.technical_document.details.forEach(d => {
            if (d.test_parameter_id) m[d.test_parameter_id] = d.value ?? '-'
        })
        return m
    }, [data])

    if (!data) return null
    return (
        <>
            <h1 className="text-2xl font-semibold mb-1">QC Result – Order {orderId}</h1>
            <div className="mb-4 text-sm text-neutral-600">
                Technical Document: {data.technical_document.number}
                {data.technical_document.version ? ` (v${data.technical_document.version})` : ''}
            </div>
            <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                <table className="min-w-full divide-y divide-neutral-200 text-sm">
                    <thead className="bg-neutral-50">
                        <tr>
                            <th rowSpan={2} className="px-6 py-3 text-left  text-xs uppercase text-neutral-500">Test Item</th>
                            <th rowSpan={2} className="px-6 py-3 text-left  text-xs uppercase text-neutral-500">Unit</th>
                            <th colSpan={TOTAL} className="px-6 py-3 text-center text-xs uppercase text-neutral-500">Measured Value</th>
                            <th rowSpan={2} className="px-6 py-3 text-center text-xs uppercase text-neutral-500">Min</th>
                            <th rowSpan={2} className="px-6 py-3 text-center text-xs uppercase text-neutral-500">Average</th>
                            <th rowSpan={2} className="px-6 py-3 text-center text-xs uppercase text-neutral-500">Max</th>
                            <th rowSpan={2} className="px-6 py-3 text-center text-xs uppercase text-neutral-500">Specified</th>
                            <th rowSpan={2} className="px-6 py-3 text-center text-xs uppercase text-neutral-500">Status</th>
                        </tr>
                        <tr>{Array.from({ length: TOTAL }).map((_, i) =>
                            <th key={i} className="px-6 py-3 border-t border-neutral-300 text-center text-xs uppercase text-neutral-500">{i + 1}</th>)}
                        </tr>
                    </thead>

                    <tbody>
                        {data.details.map(row => {
                            const p = row.test_parameter
                            const raw = row.values.map(v => v?.toString().trim()).filter(s => s !== '')
                            const nums = raw.map(toNum).filter(n => !Number.isNaN(n))
                            const strs = raw.filter((_, i) => Number.isNaN(nums[i] ?? NaN))

                            const min = nums.length ? Math.min(...nums).toFixed(2) : '-'
                            const max = nums.length ? Math.max(...nums).toFixed(2) : '-'
                            const avg = nums.length ? r2(nums.reduce((a, b) => a + b, 0) / nums.length) : NaN

                            const target = spec[p.id]
                            const targetNum = toNum(target)

                            let status: 'PASS' | 'FAIL' | '-'
                            if (!target || target === '-' || target === '') {
                                status = raw.length ? 'PASS' : '-'
                            } else if (nums.length && Number.isFinite(targetNum)) {
                                status = Number.isFinite(avg) && eq(avg, targetNum) ? 'PASS' : 'FAIL'
                            } else if (strs.length && !Number.isFinite(targetNum)) {
                                status = raw.every(s => s.toLowerCase() === target.toLowerCase()) ? 'PASS' : 'FAIL'
                            } else {
                                status = 'FAIL'
                            }
                            const pass = status === 'PASS'
                            const s = spans(Math.min(p.test_step, TOTAL))

                            return (
                                <tr key={p.id} className="even:bg-neutral-50">
                                    <td className="px-3 py-2">{p.name}</td>
                                    <td className="px-3 py-2 text-center">{p.unit ?? '-'}</td>

                                    {s.map((c, i) =>
                                        <td key={i} colSpan={c} className="px-3 py-2 text-center">
                                            {row.values[i] !== undefined ? row.values[i] : '–'}
                                        </td>)}

                                    <td className="px-3 py-2 text-center">{min}</td>
                                    <td className={`px-3 py-2 text-center ${pass ? 'bg-green-50 text-green-700 font-medium'
                                        : status === 'FAIL'
                                            ? 'bg-red-50 text-red-700 font-medium'
                                            : 'text-neutral-600'
                                        }`}>
                                        {Number.isFinite(avg) ? avg.toFixed(2) : '-'}
                                    </td>
                                    <td className="px-3 py-2 text-center">{max}</td>
                                    <td className="px-3 py-2 text-center">{target ?? '-'}</td>
                                    <td className={`px-3 py-2 text-center ${pass ? 'bg-green-50 text-green-700'
                                        : status === 'FAIL'
                                            ? 'bg-red-50 text-red-700'
                                            : 'text-neutral-500'
                                        }`}>
                                        {status}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

Result.layout = (p: any) => <MainLayout title="QC Result">{p}</MainLayout>

export default Result