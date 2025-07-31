import { InnerShadowTopRightSolid } from "@/components/icons/solid"

type SecondaryButtonProps<T extends React.ElementType> = {
    as?: T
    children?: React.ReactNode

    isLoading?: boolean
    iconPosition?: "left" | "right"
} & React.ComponentPropsWithoutRef<T>

export default function SecondaryButton<T extends React.ElementType = "button">({ as, children, isLoading, iconPosition, ...rest }: SecondaryButtonProps<T>) {
    const Button = as || "button"

    return (
        <Button {...rest} className={`${isLoading ? 'pl-4 pr-6' : 'px-6'} ${iconPosition === 'right' ? 'flex-row-reverse' : ''} inline-flex items-center gap-x-2 cursor-pointer text-sm bg-gradient-to-tr from-blue-500 to-blue-300 hover:from-blue-400 hover:to-blue-200 text-white font-medium py-2 rounded-full transition`}>
            {isLoading && <span><InnerShadowTopRightSolid className="animate-spin w-4 h-4" /></span>} <span>{children}</span>
        </Button>
    )
}