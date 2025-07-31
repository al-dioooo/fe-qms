// pages/orders/[id]/test.tsx
import { useEffect, useMemo, useState, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/router'
import type { NextPage } from 'next'
import apiClient from '@/helpers/api-client'
import MainLayout from '@/layouts/main-layout'
import PrimaryButton from '@/components/buttons/primary'
import Input from '@/components/forms/input'
import toast from 'react-hot-toast'

type TestParameter = {
    id: string
    code: string
    name: string
    unit: string | null
    test_step: number // 0..6
}

type Measurement = { value: string }

type TechnicalDocumentDetail = {
    id: string
    technical_document_id: string
    test_parameter_id?: string | null
    parameter_id?: string | null
    parameter_code?: string | null
    value?: string | number | null // used for Specified Value (unitless display)
    unit?: string | null
}

type TechnicalDocument = {
    id: string
    number: string
    details?: TechnicalDocumentDetail[]
    technical_document_details?: TechnicalDocumentDetail[]
    items?: TechnicalDocumentDetail[]
    [k: string]: any
}

const TOTAL_STEP_COLUMNS = 6

/** Distribute TOTAL_STEP_COLUMNS across `steps` input cells. */
function computeColSpans(steps: number): number[] {
    if (!steps || steps <= 0) return [TOTAL_STEP_COLUMNS]
    const base = Math.floor(TOTAL_STEP_COLUMNS / steps)
    const remainder = TOTAL_STEP_COLUMNS % steps
    return Array.from({ length: steps }, (_, i) => base + (i < remainder ? 1 : 0))
}

/** Helpers for numeric comparison */
const parseNum = (v: unknown) => {
    if (typeof v === 'number') return v
    if (typeof v === 'string') {
        const n = parseFloat(v.replace(',', '.'))
        return Number.isFinite(n) ? n : NaN
    }
    return NaN
}
const round2 = (n: number) => Math.round(n * 100) / 100
const nearlyEqual = (a: number, b: number, tol = 0.01) => Math.abs(a - b) <= tol

const TestPage: NextPage = () => {
    const router = useRouter()
    const { query } = router

    const orderId = Array.isArray(query.id) ? query.id[0] : (query.id ?? '')
    const productCode = Array.isArray(query.code) ? query.code[0] : (query.code ?? '')

    const [params, setParams] = useState<TestParameter[]>([])
    const [measurements, setMeasurements] = useState<Record<string, Measurement[]>>({})
    const [tdOptions, setTdOptions] = useState<{ id: string; number: string }[]>([])
    const [selectedTdId, setSelectedTdId] = useState<string>('')
    const [selectedTd, setSelectedTd] = useState<TechnicalDocument | null>(null)

    useEffect(() => {
        (async () => {
            // TD list
            const { data: tdRes } = await apiClient.get('/technical-document')
            const opts = (tdRes?.data?.data ?? tdRes?.data ?? []).map((d: any) => ({
                id: d.id,
                number: d.number,
            }))
            setTdOptions(opts)
            if (opts[0]) setSelectedTdId(opts[0].id)

            // Test parameters
            const { data: tpRes } = await apiClient.get('/test-parameter')
            const list: TestParameter[] = tpRes?.data?.data ?? tpRes?.data ?? []
            setParams(list)

            // Init measurement slots (by param.id)
            const initial: Record<string, Measurement[]> = {}
            list.forEach((p) => {
                initial[p.id] = Array.from({ length: p.test_step }, () => ({ value: '' }))
            })
            setMeasurements(initial)
        })()
    }, [])

    useEffect(() => {
        if (!selectedTdId) {
            setSelectedTd(null)
            return
        }
        ; (async () => {
            const { data } = await apiClient.get(`/technical-document/${selectedTdId}`)
            setSelectedTd((data?.data ?? data) as TechnicalDocument)
        })()
    }, [selectedTdId])

    const handleValueChange = (paramId: string, idx: number, v: string) => {
        setMeasurements((prev) => ({
            ...prev,
            [paramId]: prev[paramId].map((m, i) => (i === idx ? { value: v } : m)),
        }))
    }

    const toNums = (vals: Measurement[]) =>
        vals
            .map((m) => parseFloat((m.value ?? '').toString().replace(',', '.')))
            .filter((n) => !Number.isNaN(n))

    const calcMin = (vals: Measurement[]) => {
        const nums = toNums(vals)
        return nums.length ? Math.min(...nums).toFixed(2) : '-'
    }
    const calcMax = (vals: Measurement[]) => {
        const nums = toNums(vals)
        return nums.length ? Math.max(...nums).toFixed(2) : '-'
    }
    const calcAvg = (vals: Measurement[]) => {
        const nums = toNums(vals)
        return nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2) : '-'
    }
    const calcAvgNumber = (vals: Measurement[]) => {
        const nums = toNums(vals)
        return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : NaN
    }

    const tdDetails: TechnicalDocumentDetail[] = useMemo(() => {
        if (!selectedTd) return []
        return selectedTd.details ?? selectedTd.technical_document_details ?? selectedTd.items ?? []
    }, [selectedTd])

    // Map Specified Value from TD detail.value (NO UNIT appended)
    const specifiedByParamId = useMemo(() => {
        const map: Record<string, string> = {}
        if (!tdDetails.length) return map

        const byCode: Record<string, string> = {}

        for (const d of tdDetails) {
            const v = d.value
            const text = v === null || v === undefined || v === '' ? '-' : String(v)

            const pid = (d.test_parameter_id ?? d.parameter_id ?? '')?.toString().trim()
            if (pid) map[pid] = text

            const pcode = (d.parameter_code ?? '')?.toString().trim()
            if (pcode) byCode[pcode] = text
        }

        // backfill via code if id not provided
        params.forEach((p) => {
            if (!map[p.id] && byCode[p.code]) map[p.id] = byCode[p.code]
        })

        return map
    }, [tdDetails, params])

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        const payload = {
            order_id: orderId,
            technical_document_id: selectedTdId,
            parameters: params.map((p) => ({
                test_parameter_id: p.id,
                values: (measurements[p.id] ?? []).map((v) =>
                    parseFloat((v.value ?? '').toString().replace(',', '.'))
                ),
            })),
        }

        apiClient
            .post('/qc-inspection/store', payload)
            .then((response) => {
                toast.success(response?.data?.message ?? 'Submitted', { id: 'submit' })
                router.replace('/order')
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message ?? 'Submit failed', {
                    ariaProps: {
                        // @ts-ignore
                        superscript: error?.response?.status
                    },
                    id: 'submit',
                })
            })
    }

    return (
        <MainLayout title="Input QC">
            <h1 className="text-2xl font-semibold mb-4">
                QC Test – Order {orderId} (Product {productCode})
            </h1>

            {/* TD selector */}
            <div className="mb-6">
                <label className="block text-sm mb-1 font-medium">Technical Document</label>
                <select
                    value={selectedTdId}
                    onChange={(e) => setSelectedTdId(e.target.value)}
                    className="border border-neutral-300 rounded-lg p-2 w-full max-w-sm"
                >
                    {tdOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                            {opt.number}
                        </option>
                    ))}
                </select>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                    <table className="min-w-full divide-y divide-neutral-200">
                        {/* -------- two-row header preserved -------- */}
                        <thead className="bg-neutral-50 rounded-t-3xl">
                            <tr>
                                <th rowSpan={2} className="px-6 py-3 whitespace-nowrap text-left text-xs uppercase text-neutral-500">
                                    Test Item
                                </th>
                                <th rowSpan={2} className="px-6 py-3 whitespace-nowrap text-left text-xs uppercase text-neutral-500">
                                    Unit
                                </th>
                                <th colSpan={6} className="px-6 py-3 whitespace-nowrap text-center text-xs uppercase text-neutral-500">
                                    Measured Value
                                </th>
                                <th rowSpan={2} className="px-6 py-3 whitespace-nowrap text-center text-xs uppercase text-neutral-500">
                                    Min
                                </th>
                                <th rowSpan={2} className="px-6 py-3 whitespace-nowrap text-center text-xs uppercase text-neutral-500">
                                    Average
                                </th>
                                <th rowSpan={2} className="px-6 py-3 whitespace-nowrap text-center text-xs uppercase text-neutral-500">
                                    Max
                                </th>
                                <th rowSpan={2} className="px-6 py-3 whitespace-nowrap text-center text-xs uppercase text-neutral-500">
                                    Specified Value
                                </th>
                                <th rowSpan={2} className="px-6 py-3 whitespace-nowrap text-center text-xs uppercase text-neutral-500">
                                    Status
                                </th>
                            </tr>
                            <tr>
                                {Array.from({ length: TOTAL_STEP_COLUMNS }).map((_, i) => (
                                    <th
                                        key={i}
                                        className="px-6 py-3 whitespace-nowrap border-t border-neutral-300 text-center text-xs uppercase text-neutral-500"
                                    >
                                        {i + 1}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {params.map((p) => {
                                const vals = measurements[p.id] ?? []
                                const steps = Math.max(0, Math.min(p.test_step ?? 0, TOTAL_STEP_COLUMNS))
                                const spans = computeColSpans(steps)

                                // compute numeric avg and specified
                                const avgNumRaw = calcAvgNumber(vals)
                                const avgNum = Number.isFinite(avgNumRaw) ? round2(avgNumRaw) : NaN
                                const specStr = specifiedByParamId[p.id]
                                const specNum = parseNum(specStr)

                                const hasBoth = Number.isFinite(avgNum) && Number.isFinite(specNum)
                                const isPass = hasBoth ? nearlyEqual(avgNum, specNum) : false
                                const status = hasBoth ? (isPass ? 'PASS' : 'FAIL') : '-'
                                const avgTone =
                                    !hasBoth
                                        ? 'text-neutral-600'
                                        : isPass
                                            ? 'bg-green-50 text-green-700 font-medium'
                                            : 'bg-red-50 text-red-700 font-medium'
                                const statusTone =
                                    status === 'PASS'
                                        ? 'bg-green-50 text-green-700'
                                        : status === 'FAIL'
                                            ? 'bg-red-50 text-red-700'
                                            : 'text-neutral-500'

                                return (
                                    <tr key={p.id} className="even:bg-neutral-50 text-sm">
                                        {/* Test item & unit */}
                                        <td className="px-3 py-2">{p.name}</td>
                                        <td className="px-3 py-2 text-center">{p.unit ?? '-'}</td>

                                        {/* Inputs: render exactly `steps` cells; each spans to fill 6 columns */}
                                        {steps > 0 ? (
                                            spans.map((span, idx) => (
                                                <td key={idx} colSpan={span} className="px-2 py-1 text-center">
                                                    <Input
                                                        value={vals[idx]?.value ?? ''}
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                            handleValueChange(p.id, idx, e.target.value)
                                                        }
                                                    />
                                                </td>
                                            ))
                                        ) : (
                                            <td colSpan={TOTAL_STEP_COLUMNS} className="px-2 py-1 text-center text-neutral-400">–</td>
                                        )}

                                        {/* live stats (Average tinted) */}
                                        <td className="px-3 py-2 text-center">{calcMin(vals)}</td>
                                        <td className={`px-3 py-2 text-center ${avgTone}`}>
                                            {Number.isFinite(avgNum) ? avgNum.toFixed(2) : '-'}
                                        </td>
                                        <td className="px-3 py-2 text-center">{calcMax(vals)}</td>

                                        {/* specified value (value only) */}
                                        <td className="px-3 py-2 text-center">{specStr ?? '-'}</td>

                                        {/* status */}
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
        </MainLayout>
    )
}

export default TestPage