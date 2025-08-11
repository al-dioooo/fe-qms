function parseSpecRange(spec?: string) {
    const s = (spec ?? '').trim()
    if (!s || s === '-') return { kind: 'none' } as const
    const norm = s.replace('+/-', '±')

    // e.g. "5.5 ± 0.1", "1,60 ± 10%", "41 ± 2.0"
    const m = norm.match(/^\s*([+-]?\d+(?:[.,]\d+)?)\s*±\s*([+-]?\d+(?:[.,]\d+)?)(\s*%?)\s*$/i)
    if (m) {
        const mid = parseFloat(m[1].replace(',', '.'))
        const tolRaw = parseFloat(m[2].replace(',', '.'))
        const isPct = (m[3] ?? '').trim() === '%'
        if (Number.isFinite(mid) && Number.isFinite(tolRaw)) {
            const tol = isPct ? Math.abs(mid) * (tolRaw / 100) : tolRaw
            return { kind: 'numeric', min: mid - tol, max: mid + tol } as const
        }
    }

    // plain numeric like "5.5"
    const n = parseFloat(norm.replace(',', '.'))
    if (Number.isFinite(n)) return { kind: 'numeric', target: n } as const

    // else treat as string spec
    return { kind: 'string', target: s } as const
}