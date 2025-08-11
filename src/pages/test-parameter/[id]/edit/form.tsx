import PrimaryButton from "@/components/buttons/primary"
import ErrorMessage from "@/components/forms/error-message"
import Input from "@/components/forms/input"
import Label from "@/components/forms/label"
import { useEffect, useState } from "react"

type Props = {
    defaultValues?: { name?: string; test_step?: number }
    onSubmit: (data: { name: string; test_step: number }) => void
    isLoading?: boolean
    errors?: Record<string, string | string[]>
}

export default function Form({ defaultValues, onSubmit, isLoading = false, errors = {} }: Props) {
    const [name, setName] = useState<string>(defaultValues?.name ?? "")
    const [testStep, setTestStep] = useState<string>(defaultValues?.test_step?.toString() ?? "")

    useEffect(() => {
        setName(defaultValues?.name ?? "")
        setTestStep(defaultValues?.test_step?.toString() ?? "")
    }, [defaultValues?.name, defaultValues?.test_step])

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const ts = Number.parseInt(testStep as string, 10)
        onSubmit({ name: name.trim(), test_step: Number.isFinite(ts) ? ts : 0 })
    }

    return (
        <form onSubmit={submitHandler} className="mt-8 space-y-8">
            <div className="mt-10 sm:mt-0">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <div className="px-4 sm:px-0">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Test Parameter</h3>
                            <p className="mt-1 text-sm text-gray-600">Update the name and the number of measurement steps.</p>
                        </div>
                    </div>

                    <div className="mt-5 md:col-span-2 md:mt-0">
                        <div className="border border-neutral-200 rounded-3xl">
                            <div className="p-4 sm:p-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="col-span-2 space-y-1 sm:col-span-1">
                                        <Label htmlFor="name" value="Name" />
                                        <Input
                                            id="name"
                                            placeholder="e.g. Outer diameter"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}

                                        />
                                        {/* <ErrorMessage error={errors["name"]} /> */}
                                    </div>

                                    <div className="col-span-2 space-y-1 sm:col-span-1">
                                        <Label htmlFor="test_step" value="Test Steps (0–6)" />
                                        <Input
                                            id="test_step"
                                            type="number"
                                            min={0}
                                            max={6}
                                            // step={1}
                                            placeholder="e.g. 3"
                                            value={testStep}
                                            onChange={(e) => setTestStep(e.target.value)}

                                        />
                                        {/* <ErrorMessage error={errors["test_step"]} /> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden sm:block" aria-hidden="true">
                <div className="py-5">
                    <div className="border-t border-gray-200" />
                </div>
            </div>

            <div className="mt-8 text-right">
                <PrimaryButton isLoading={isLoading} as="button" type="submit">
                    Save Changes
                </PrimaryButton>
            </div>
        </form>
    )
}