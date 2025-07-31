// pages/orders/[id]/test.tsx
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";

interface TestParam {
    name: string;
    expectedValue: string;
    userValue: string;
}

interface TestResult {
    name: string;
    expected: string;
    actual: string;
    pass: boolean;
}

const OrderTestForm: NextPage = () => {
    const { query } = useRouter();
    const orderId = Array.isArray(query.id) ? query.id[0] : query.id ?? "";

    const initialParams: TestParam[] = [
        { name: "Connection Timeout", expectedValue: "30s", userValue: "" },
        { name: "Response Payload Size", expectedValue: "< 1MB", userValue: "" },
        { name: "Authentication Token Validity", expectedValue: "15m", userValue: "" },
    ];

    const [params, setParams] = useState(initialParams);
    const [results, setResults] = useState<TestResult[] | null>(null);

    const handleChange = (i: number, v: string) =>
        setParams(ps =>
            ps.map((p, idx) => (idx === i ? { ...p, userValue: v } : p))
        );

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setResults(
            params.map(p => ({
                name: p.name,
                expected: p.expectedValue,
                actual: p.userValue,
                pass: p.userValue.trim() === p.expectedValue.trim(),
            }))
        );
    };

    return (
        <div className="space-y-8">
            {/* Back Link */}
            <Link
                href={`/order/${orderId}`}
                className="inline-block text-blue-600 hover:underline text-sm"
            >
                &larr; Back to Order #{orderId}
            </Link>

            {/* Form Card */}
            <div className="bg-neutral-50 border-white border shadow-[0px_5px_20px_rgba(0,0,0,0.10)] rounded-4xl p-6">
                <h1 className="text-2xl font-semibold mb-4">
                    Run Tests for Order #{orderId}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {params.map((p, i) => (
                        <div key={i} className="space-y-1">
                            <label htmlFor={`param-${i}`} className="block text-sm font-medium text-neutral-700">
                                {p.name}
                            </label>
                            <div className="flex items-center gap-4">
                                <input id={`param-${i}`} type="text" value={p.userValue} onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleChange(i, e.target.value)
                                } className="flex-1 border border-neutral-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter QC value..."
                                />
                                <span className="whitespace-nowrap px-3 py-2 bg-neutral-100 rounded-lg border border-neutral-200 text-neutral-600">
                                    Expected: {p.expectedValue}
                                </span>
                            </div>
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-2xl transition"
                    >
                        Submit Tests
                    </button>
                </form>
            </div>

            {/* Results Card */}
            {results && (
                <div className="bg-neutral-50 border-white border shadow-[0px_5px_20px_rgba(0,0,0,0.10)] rounded-4xl p-6">
                    <h2 className="text-xl font-semibold mb-4">Results</h2>
                    <ul className="divide-y divide-neutral-200">
                        {results.map((r, i) => (
                            <li
                                key={i}
                                className="py-3 flex justify-between items-center text-base"
                            >
                                <div>
                                    <p className="font-medium">{r.name}</p>
                                    <p className="text-sm text-neutral-500">
                                        Expected: {r.expected} · Entered: {r.actual}
                                    </p>
                                </div>
                                <span
                                    className={`font-semibold ${r.pass ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {r.pass ? "PASS" : "FAIL"}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default OrderTestForm;
