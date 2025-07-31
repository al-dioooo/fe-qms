export default function ErrorMessage({ error }: { error: string[] | undefined }) {
    return (
        <>
            {error && error.map((row, index) => (
                <>
                    <span className="text-xs leading-none text-red-500">{row}</span>
                    <br />
                </>
            ))}
        </>
    )
}