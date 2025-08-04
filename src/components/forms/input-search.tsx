import { Search } from "@/components/icons/outline"

export default function InputSearch({ onChange, value, id, disabled = false, min, max, maxLength, placeholder = "" }: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, value?: string | number, id?: string, disabled?: boolean, min?: number, max?: number, maxLength?: number, placeholder?: string }) {
    return (
        <div className="relative hidden sm:block">
            <div className="absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-neutral-500" />
            </div>
            <input placeholder={placeholder} min={min} max={max} maxLength={maxLength} disabled={disabled} onChange={onChange} value={value} id={id} autoComplete="off" type="text" className="w-64 py-3 pl-8 pr-4 text-xs transition border border-neutral-200 focus:outline-none rounded-xl focus:border-neutral-400 focus:ring focus:ring-neutral-200" />
        </div>
    )
}