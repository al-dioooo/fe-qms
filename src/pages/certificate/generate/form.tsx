import PrimaryButton from "@/components/buttons/primary"
import ErrorMessage from "@/components/forms/error-message"
import Input from "@/components/forms/input"
import Label from "@/components/forms/label"
import SelectDescription from "@/components/forms/select-description"
import { useOrderDetails } from "@/hooks/repositories/useOrderDetails"
import { useState } from "react"

export default function Form({ onSubmit = () => { }, isLoading = false, errors }: { onSubmit: (data: unknown) => void, isLoading?: boolean, errors?: any }) {
    // Data
    const { data: orderDetailData, isLoading: isLoadingOrderDetailData } = useOrderDetails({ paginate: false })

    // Forms
    const [packingListNumber, setPackingListNumber] = useState("")
    const [customerName, setCustomerName] = useState("")
    const [typeSize, setTypeSize] = useState("")
    const [totalQuantity, setTotalQuantity] = useState("")
    const [orderDetail, setOrderDetail] = useState("")
    const [cableMarking, setCableMarking] = useState("")
    const [issuedBy, setIssuedBy] = useState("")
    const [preparedBy, setPreparedBy] = useState("")

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        onSubmit({
            packing_list_number: packingListNumber,
            customer_name: customerName,
            type_size: typeSize,
            total_quantity: totalQuantity,
            order_detail_id: orderDetail,
            cable_marking: cableMarking,
            issued_by: issuedBy,
            prepared_by: preparedBy
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
                                    <div>
                                        <Label htmlFor="lot_number" value="LOT/SO Number" />
                                        {/* <select onChange={(e) => setOrderDetail(e.target.value)} className="placeholder:text-neutral-500 file:border-solid file:border file:px-3 file:text-xs file:border-neutral-200 file:py-1 file:rounded-full block w-full px-2 py-2 mt-1 text-sm transition border border-neutral-200 focus:outline-none rounded-xl focus:border-neutral-400 focus:ring focus:ring-neutral-200" name="lot_number" id="lot_number">
                                            {orderDetailData?.data?.map((row: any) => (
                                                <option key={row.id} value={row.id}>{row.lot_number}</option>
                                            ))}
                                        </select> */}
                                        <SelectDescription error={errors.lot_number} onChange={(value: any) => setOrderDetail(value)} selection={orderDetailData?.data} isLoading={isLoadingOrderDetailData} value={orderDetail} keyValue={(value) => value.id} title={(value: any) => value.lot_number} description={(value: any) => value.so_number} placeholder="Select LOT/SO Number" />
                                        <ErrorMessage error={errors.lot_number} />
                                    </div>
                                    <div>
                                        <Label htmlFor="packing_list_number" value="Packing List Number" />
                                        <Input placeholder="Ex: 1200/FG/242000748/2024" onChange={(e) => setPackingListNumber(e.target.value)} id="packing_list_number" error={errors.packing_list_number} />
                                        <ErrorMessage error={errors.packing_list_number} />
                                    </div>
                                    <div>
                                        <Label htmlFor="customer_name" value="Customer Name" />
                                        <Input placeholder="Ex: Alice" onChange={(e) => setCustomerName(e.target.value)} id="customer_name" error={errors.customer_name} />
                                        <ErrorMessage error={errors.customer_name} />
                                    </div>
                                    <div>
                                        <Label htmlFor="type_size" value="Type Size" />
                                        <Input placeholder="Ex: SM.D-ADSS-A-DG LT 6/1 T Span 100" onChange={(e) => setTypeSize(e.target.value)} id="type_size" error={errors.type_size} />
                                        <ErrorMessage error={errors.type_size} />
                                    </div>
                                    <div>
                                        <Label htmlFor="total_quantity" value="Total Quantity" />
                                        <Input placeholder="Ex: 300 Meters (1 Drum)" onChange={(e) => setTotalQuantity(e.target.value)} id="total_quantity" error={errors.total_quantity} />
                                        <ErrorMessage error={errors.total_quantity} />
                                    </div>
                                    <div>
                                        <Label htmlFor="cable_marking" value="Cable Marking" />
                                        <Input placeholder="Ex: JEMBO CABLE - JSN-Jaringanku- 2025-KABEL OPTIK SM. D - ADSS A DG LT 6/1T" onChange={(e) => setCableMarking(e.target.value)} id="cable_marking" error={errors.cable_marking} />
                                        <ErrorMessage error={errors.cable_marking} />
                                    </div>
                                    <div>
                                        <Label htmlFor="issued_by" value="Issued By" />
                                        <Input placeholder="Ex: Alice" onChange={(e) => setIssuedBy(e.target.value)} id="issued_by" error={errors.issued_by} />
                                        <ErrorMessage error={errors.issued_by} />
                                    </div>
                                    <div>
                                        <Label htmlFor="prepared_by" value="Prepared By" />
                                        <Input placeholder="Ex: Arisu" onChange={(e) => setPreparedBy(e.target.value)} id="prepared_by" error={errors.prepared_by} />
                                        <ErrorMessage error={errors.prepared_by} />
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