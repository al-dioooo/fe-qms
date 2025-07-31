import { Transition } from "@headlessui/react"
import { Toaster, ToastIcon, resolveValue } from "react-hot-toast"

export default function Toast() {
    return (
        <Toaster position="bottom-left" toastOptions={{ error: { duration: 8000 } }}>
            {(t) => (
                <Transition
                    as="div"
                    appear
                    show={t.visible}
                    className="flex items-start p-4 transform bg-white shadow-xl rounded-3xl"
                    enter="transition-all duration-500"
                    enterFrom="blur translate-y-8 opacity-0 scale-50"
                    enterTo="blur-0 opacity-100 scale-100"
                    leave="transition-all duration-500"
                    leaveFrom="blur-0 opacity-100 scale-100"
                    leaveTo="blur translate-y-8 opacity-0 scale-75">
                        {/* @ts-expect-error Does not exist */}
                    <div className={`${t.ariaProps.superscript ? 'mt-[6px]' : ''}`}>
                        <ToastIcon toast={t} />
                    </div>
                    <div className="px-2">
                        {/* @ts-expect-error Does not exist */}
                        {t.ariaProps.superscript && (<p className="text-xxs text-neutral-700">{t.ariaProps.superscript}</p>)}
                        {/* @ts-expect-error Does not exist */}
                        <p className={`${t.ariaProps.superscript ? '' : ''} leading-tight`}>{resolveValue(t.message)}</p>
                    </div>
                </Transition>
            )}
        </Toaster>
    )
}