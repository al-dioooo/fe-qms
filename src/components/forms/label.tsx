export default function Label({ htmlFor, value, required }: { htmlFor?: string, value: string, required?: boolean }) {
    return (
        <label htmlFor={htmlFor} className="text-xs text-neutral-700">
            {value}{required && <span className="text-red-500">*</span>}
        </label>
    )
}