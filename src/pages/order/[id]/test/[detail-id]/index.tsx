import { useEffect, useMemo, useState, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/router'
import apiClient from '@/helpers/api-client'
import MainLayout from '@/layouts/main-layout'
import PrimaryButton from '@/components/buttons/primary'
import Input from '@/components/forms/input'
import toast from 'react-hot-toast'

type TestParameter = { id: string; code: string; name: string; unit: string | null; test_step: number }
type Measurement = { value: string }
type TechnicalDocumentDetail = { test_parameter_id?: string | null; parameter_id?: string | null; parameter_code?: string | null; value?: string | number | null }
type TechnicalDocument = { id: string; number: string; details?: TechnicalDocumentDetail[]; technical_document_details?: TechnicalDocumentDetail[]; items?: TechnicalDocumentDetail[] }

const TOTAL_COLS = 6
const spans = (s: number) => { if (!s || s <= 0) return [TOTAL_COLS]; const b = Math.floor(TOTAL_COLS / s); const r = TOTAL_COLS % s; return Array.from({ length: s }, (_, i) => b + (i < r ? 1 : 0)) }
const toNum = (v: unknown) => typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'))
const r2 = (n: number) => Math.round(n * 100) / 100
const eq = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t

const TestPage = () => {
    const { query, replace } = useRouter()
    const orderId = Array.isArray(query.id) ? query.id[0] : query.id
    const detailId = Array.isArray(query['detail-id']) ? query['detail-id'][0] : query['detail-id']

    const [params, setParams] = useState<TestParameter[]>([])
    const [measure, setMeasure] = useState<Record<string, Measurement[]>>({})
    const [tdOpts, setTdOpts] = useState<{ id: string; number: string }[]>([])
    const [tdId, setTdId] = useState('')
    const [td, setTd] = useState<TechnicalDocument | null>(null)

    // --- option list ----------------------------------------------------------
    useEffect(() => {
        ; (async () => {
            const { data } = await apiClient.get('/technical-document')
            const opts = (data?.data?.data ?? data?.data ?? []).map((d: any) => ({ id: d.id, number: d.number }))
            setTdOpts(opts)
            if (opts[0]) setTdId(opts[0].id)
        })()
    }, [])

    // --- parameters for this order-detail -------------------------------------
    useEffect(() => {
        if (!detailId) return
            ; (async () => {
                const { data } = await apiClient.get(`/qc-inspection/by/order/${detailId}/parameter`)
                const list: TestParameter[] = data?.data?.data ?? data?.data ?? []
                setParams(list)
                const init: Record<string, Measurement[]> = {}
                list.forEach(p => { init[p.id] = Array.from({ length: p.test_step }, () => ({ value: '' })) })
                setMeasure(init)
            })()
    }, [detailId])

    // --- selected Technical Document -----------------------------------------
    useEffect(() => {
        if (!tdId) { setTd(null); return }
        ; (async () => {
            const { data } = await apiClient.get(`/technical-document/${tdId}`)
            setTd(data?.data ?? data)
        })()
    }, [tdId])

    const tdDetails = useMemo<TechnicalDocumentDetail[]>(() => td?.details ?? td?.technical_document_details ?? td?.items ?? [], [td])

    const specified = useMemo(() => {
        const m: Record<string, string> = {}
        const byCode: Record<string, string> = {}
        tdDetails.forEach(d => {
            const val = d.value ?? '-'
            const pid = (d.test_parameter_id ?? d.parameter_id ?? '')?.toString().trim()
            if (pid) m[pid] = String(val)
            const pc = (d.parameter_code ?? '')?.toString().trim()
            if (pc) byCode[pc] = String(val)
        })
        params.forEach(p => { if (!m[p.id] && byCode[p.code]) m[p.id] = byCode[p.code] })
        return m
    }, [tdDetails, params])

    const submit = (e: FormEvent) => {
        e.preventDefault()
        const payload = {
            order_id: orderId,
            order_detail_id: detailId,
            technical_document_id: tdId,
            parameters: params.map(p => ({
                test_parameter_id: p.id,
                values: (measure[p.id] ?? []).map(v => (v.value ?? '').toString().trim())
            }))
        }
        apiClient.post('/qc-inspection', payload)
            .then(r => { toast.success(r?.data?.message ?? 'Submitted'); replace(`/order/${orderId}`) })
            .catch(err => toast.error(err?.response?.data?.message ?? 'Submit failed'))
    }

    return (
        <>
            <h1 className="text-2xl font-semibold mb-4">QC Test – Order {orderId} (Detail {detailId})</h1>

            <div className="mb-6">
                <label className="block text-sm mb-1 font-medium">Technical Document</label>
                <select value={tdId} onChange={e => setTdId(e.target.value)} className="border border-neutral-300 rounded-lg p-2 w-full max-w-sm">
                    {tdOpts.map(o => <option key={o.id} value={o.id}>{o.number}</option>)}
                </select>
            </div>

            <form onSubmit={submit}>
                <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                    <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th rowSpan={2} className="px-6 py-3 text-left text-xs uppercase text-neutral-500">Test Item</th>
                                <th rowSpan={2} className="px-6 py-3 text-left text-xs uppercase text-neutral-500">Unit</th>
                                <th colSpan={TOTAL_COLS} className="px-6 py-3 text-center text-xs uppercase text-neutral-500">Measured Value</th>
                                <th rowSpan={2} className="px-6 py-3 text-center text-xs uppercase text-neutral-500">Min</th>
                                <th rowSpan={2} className="px-6 py-3 text-center text-xs uppercase text-neutral-500">Average</th>
                                <th rowSpan={2} className="px-6 py-3 text-center text-xs uppercase text-neutral-500">Max</th>
                                <th rowSpan={2} className="px-6 py-3 text-center text-xs uppercase text-neutral-500">Specified</th>
                                <th rowSpan={2} className="px-6 py-3 text-center text-xs uppercase text-neutral-500">Status</th>
                            </tr>
                            <tr>{Array.from({ length: TOTAL_COLS }).map((_, i) =>
                                <th key={i} className="px-6 py-3 border-t border-neutral-300 text-center text-xs uppercase text-neutral-500">{i + 1}</th>
                            )}</tr>
                        </thead>

                        <tbody>
                            {params.map(p => {
                                const vals = measure[p.id] ?? []
                                const steps = Math.min(p.test_step, TOTAL_COLS)
                                const colspans = spans(steps)

                                /* ------------------------------------------------------------
                                 * 1️⃣  Gather raw input strings and detect “numeric mode”
                                 * ---------------------------------------------------------- */
                                const rawInputs = vals.map(v => (v.value ?? '').toString().trim()).filter(s => s !== '')
                                const numericOK = rawInputs.length &&
                                    rawInputs.every(s => !Number.isNaN(parseFloat(s.replace(',', '.'))))

                                /* numeric statistics (only meaningful in numeric mode) */
                                const nums = numericOK ? rawInputs.map(s => parseFloat(s.replace(',', '.'))) : []
                                const minVal = nums.length ? Math.min(...nums).toFixed(2) : '-'
                                const maxVal = nums.length ? Math.max(...nums).toFixed(2) : '-'
                                const avgNum = nums.length ? r2(nums.reduce((a, b) => a + b, 0) / nums.length) : NaN

                                /* specified target (may be numeric or string or missing) */
                                const specStr = specified[p.id]            // '-' | undefined | '15' | 'Round Stranded'
                                const specNum = toNum(specStr)

                                /* ------------------------------------------------------------
 * 2️⃣  Status rules (updated)
 *    • no input                     ➜ status = '-'
 *    • no specified value (target)  ➜ PASS (numeric or string)
 *    • numeric spec                 ➜ compare avgNum ≈ spec
 *    • string  spec                 ➜ every input === spec (ci)
 * ---------------------------------------------------------- */
                                let status: 'PASS' | 'FAIL' | '-'

                                if (rawInputs.length === 0) {
                                    status = '-'                                                    // empty input
                                } else if (!specStr || specStr === '-' || specStr === '') {
                                    status = 'PASS'                                                 // no target → PASS
                                } else if (numericOK && Number.isFinite(specNum)) {
                                    status = Number.isFinite(avgNum) && eq(avgNum, specNum) ? 'PASS' : 'FAIL'
                                } else if (!numericOK && !Number.isFinite(specNum)) {
                                    const target = specStr.toLowerCase()
                                    status = rawInputs.every(s => s.toLowerCase() === target) ? 'PASS' : 'FAIL'
                                } else {
                                    status = 'FAIL'                                                 // mismatched types
                                }

                                const pass = status === 'PASS'
                                const avgTone = numericOK
                                    ? pass
                                        ? 'bg-green-50 text-green-700 font-medium'
                                        : 'bg-red-50 text-red-700 font-medium'
                                    : 'text-neutral-600'

                                const statusTone =
                                    pass
                                        ? 'bg-green-50 text-green-700'
                                        : status === 'FAIL'
                                            ? 'bg-red-50 text-red-700'
                                            : 'text-neutral-500'

                                return (
                                    <tr key={p.id} className="even:bg-neutral-50 text-sm">
                                        <td className="px-3 py-2">{p.name}</td>
                                        <td className="px-3 py-2 text-center">{p.unit ?? '-'}</td>

                                        {steps > 0
                                            ? colspans.map((c, i) => (
                                                <td key={i} colSpan={c} className="px-2 py-1 text-center">
                                                    <Input value={vals[i]?.value ?? ''}
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                            setMeasure(m => ({
                                                                ...m,
                                                                [p.id]: m[p.id].map((o, j) => j === i ? { value: e.target.value } : o)
                                                            }))}
                                                    />
                                                </td>
                                            ))
                                            : <td colSpan={TOTAL_COLS} className="text-center text-neutral-400">–</td>}

                                        <td className="px-3 py-2 text-center">{minVal}</td>
                                        <td className={`px-3 py-2 text-center ${avgTone}`}>
                                            {Number.isFinite(avgNum) ? avgNum.toFixed(2) : '-'}
                                        </td>
                                        <td className="px-3 py-2 text-center">{maxVal}</td>
                                        <td className="px-3 py-2 text-center">{specStr ?? '-'}</td>
                                        <td className={`px-3 py-2 text-center ${statusTone}`}>{status}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6">
                    <PrimaryButton as="button" type="submit">Submit Test</PrimaryButton>
                </div>
            </form>
        </>
    )
}

TestPage.layout = (p: any) => <MainLayout title="Input QC">{p}</MainLayout>

export default TestPage