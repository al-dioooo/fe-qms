import PrimaryButton from "@/components/buttons/primary"
import ErrorMessage from "@/components/forms/error-message"
import Input from "@/components/forms/input"
import Label from "@/components/forms/label"
import { useState } from "react"

export default function Form({ onSubmit = () => { }, isLoading = false }: { onSubmit: (data: any) => void, isLoading?: boolean }) {
    const errors: any = {}

    const [file, setFile] = useState<any>()

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        onSubmit({
            file
        })
    }

    return (
        <form onSubmit={submitHandler} className="mt-8 space-y-8">
            <div className="mt-10 sm:mt-0">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <div className="px-4 sm:px-0">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Main Form</h3>
                            <p className="mt-1 text-sm text-gray-600">Please Fill The Provided Form Input</p>
                        </div>
                    </div>
                    <div className="mt-5 md:col-span-2 md:mt-0">
                        <div className="border border-neutral-200 rounded-3xl">
                            <div className="p-4 sm:p-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="col-span-2 space-y-4 sm:col-span-1">
                                        <div>
                                            <Label htmlFor="inspection_file" value="Inspection File" />
                                            <Input type="file" placeholder="Caliburn AK3 - White" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} id="inspection_file" error={errors.inspection_file} />
                                            <ErrorMessage error={errors.inspection_file} />
                                        </div>
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
                {/* <button type="submit" className="items-center px-6 py-3 text-white transition bg-neutral-800 rounded-xl active:hover:scale-90">
                    <span>Submit</span>
                </button> */}
                <PrimaryButton isLoading={isLoading} as="button" type="submit">
                    Submit
                </PrimaryButton>
            </div>
        </form>
    )
}