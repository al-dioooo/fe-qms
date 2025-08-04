import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { Check, ChevronUpDown } from '@/components/icons/outline'

type KeyLike = string | number

type SelectDescriptionProps<T, K extends KeyLike = string> = {
    selection?: T[]
    isLoading?: boolean
    /** The key of the selected item (compared against keyValue(row)) */
    value?: K
    placeholder?: string
    /** Returns the unique key for an item (used to compare with `value`) */
    keyValue?: (row: T) => K
    /** Main label renderer */
    title?: (row: T) => React.ReactNode
    /** Secondary label renderer (small text) */
    description?: (row: T) => React.ReactNode
    /** Called with the selected key whenever selection changes */
    onChange?: (val: K | undefined) => void
    disabled?: boolean
    error?: boolean
    /** If true, show description above title (reverse order) */
    reverse?: boolean
}

function SelectDescription<T, K extends KeyLike = string>({
    selection = [],
    isLoading = false,
    value,
    placeholder = 'Select…',
    keyValue = (row: T) => (row as unknown as { id: K })?.id, // sensible default
    title = (row: T) => (row as unknown as { name?: string })?.name ?? '',
    description = () => null,
    onChange = () => { },
    disabled = false,
    error = false,
    reverse = false,
}: SelectDescriptionProps<T, K>) {
    const findByValue = useMemo(
        () => (val?: K) =>
            selection.find((row) => {
                try {
                    return keyValue(row) === val
                } catch {
                    return false
                }
            }),
        [selection, keyValue]
    )

    const [selected, setSelected] = useState<T | undefined>(
        value !== undefined ? findByValue(value) : undefined
    )

    // Notify parent when internal selected changes
    useEffect(() => {
        onChange(selected !== undefined ? (keyValue(selected) as K) : undefined)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected])

    // Sync internal state when (value/selection/loading) changes
    useEffect(() => {
        if (!isLoading) {
            if (value !== undefined) {
                setSelected(findByValue(value) ?? undefined)
            } else {
                setSelected(undefined)
            }
        }
    }, [isLoading, value, findByValue])

    const hasSelection = !!selected
    const buttonText =
        isLoading ? "Loading Data" : (hasSelection ? title(selected as T) : placeholder)

    return (
        <Listbox value={selected} onChange={setSelected} disabled={disabled}>
            <div className="relative mt-1">
                <Listbox.Button
                    className={[
                        error ? 'border-red-200' : 'border-neutral-200',
                        !isLoading && hasSelection ? '' : 'text-neutral-500',
                        disabled ? 'bg-neutral-50 opacity-75' : '',
                        'w-full p-2 text-sm text-left transition border focus:outline-none rounded-xl',
                        'hover:border-neutral-400 focus:border-neutral-400 focus:ring focus:ring-neutral-200',
                    ].join(' ')}
                >
                    <span className="block truncate">{buttonText}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronUpDown className="w-5 h-5 text-neutral-400" aria-hidden="true" />
                    </span>
                </Listbox.Button>

                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute z-10 w-full p-1 mt-1 overflow-auto text-base bg-white border shadow-lg rounded-xl max-h-60 border-neutral-200 focus:outline-none sm:text-sm">
                        {selection.length ? (
                            selection.map((row, index) => (
                                <Listbox.Option
                                    key={index}
                                    className={({ active }) =>
                                        [
                                            'relative cursor-pointer select-none py-2 px-2 rounded-lg transition',
                                            active ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-900',
                                        ].join(' ')
                                    }
                                    value={row}
                                >
                                    {({ selected }) => (
                                        <>
                                            <div className={['flex pr-6', reverse ? 'flex-col-reverse' : 'flex-col'].join(' ')}>
                                                <span className="block truncate">{title(row)}</span>
                                                <span className="block truncate text-xs text-neutral-600">
                                                    {description(row)}
                                                </span>
                                            </div>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                <div
                                                    className={[
                                                        'w-5 h-5 flex items-center justify-center rounded-full',
                                                        selected ? 'bg-neutral-600 text-white' : 'border border-neutral-300',
                                                    ].join(' ')}
                                                >
                                                    {selected && <Check className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />}
                                                </div>
                                            </span>
                                        </>
                                    )}
                                </Listbox.Option>
                            ))
                        ) : (
                            <div className="relative px-4 py-2 text-xs transition rounded-lg cursor-pointer select-none text-neutral-500">
                                <hr className="border-neutral-200" />
                                <span className="absolute inset-0 flex justify-center">
                                    <span className="px-2 bg-white">No Selection</span>
                                </span>
                            </div>
                        )}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    )
}

export default SelectDescription