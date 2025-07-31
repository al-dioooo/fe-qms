"use client";

// pages/test-parameter/create.tsx ------------------------------------------------
// Fix: previous version imported `axiosFetcher` and tried to call `.post`, which
// is not available on that helper function. We now create an **Axios instance**
// locally (reusing the same base URL/bearer‑token logic) and use it for POST.
// -----------------------------------------------------------------------------

import { useState } from "react";
import { useRouter } from "next/router";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";

import { Plus, Trash } from "@/components/icons/outline";
import MainLayout from "@/layouts/main-layout";

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

interface DetailRow {
    name: string;
    unit: string;
    value: string;
    description?: string;
}

interface FormValues {
    name: string;
    description?: string;
    details: DetailRow[];
}

// ──────────────────────────────────────────────────────────────────────────────
// Axios instance with Bearer token (mirrors the global one from hooks)
// ──────────────────────────────────────────────────────────────────────────────

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://api-qms.test/api",
});

api.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
        // @ts-ignore
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }
    return config;
});

// ──────────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────────

export default function CreateTestParameter() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            name: "",
            description: "",
            details: [
                {
                    name: "",
                    unit: "",
                    value: "",
                    description: "",
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "details",
    });

    const onSubmit = async (values: FormValues) => {
        try {
            await api.post("/test-parameter", values);
            // Success: go back to list or show toast
            router.push("/test-parameter");
        } catch (err: any) {
            console.error(err);
            alert(
                err?.response?.data?.message ?? "Failed to create Test Parameter."
            );
        }
    };

    return (
        <MainLayout title="Create Test Parameter">
            <div className="space-y-8">
                {/* <h1 className="text-2xl font-semibold">Create Test Parameter</h1> */}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 bg-neutral-50 border-white border shadow-[0px_5px_20px_rgba(0,0,0,0.10)] rounded-4xl p-6"
                >
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Name<span className="text-red-500"> *</span>
                        </label>
                        <input
                            {...register("name", { required: "Name is required" })}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            placeholder="Parameter name"
                        />
                        {errors.name && (
                            <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Description
                        </label>
                        <textarea
                            {...register("description")}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            placeholder="Optional description"
                            rows={3}
                        />
                    </div>

                    {/* Detail rows */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-3">
                            Details<span className="text-red-500"> *</span>
                        </label>
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="grid grid-cols-12 gap-3 items-end bg-white p-4 rounded-xl border border-neutral-200"
                                >
                                    <div className="col-span-3">
                                        <label className="block text-xs font-medium mb-1">Name</label>
                                        <input
                                            {...register(`details.${index}.name` as const, {
                                                required: "Name required",
                                            })}
                                            className="w-full border rounded-lg px-2 py-1 text-xs"
                                        />
                                        {errors.details?.[index]?.name && (
                                            <p className="text-red-600 text-[11px] mt-0.5">
                                                {errors.details[index]?.name?.message as string}
                                            </p>
                                        )}
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-xs font-medium mb-1">Unit</label>
                                        <input
                                            {...register(`details.${index}.unit` as const)}
                                            className="w-full border rounded-lg px-2 py-1 text-xs"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-xs font-medium mb-1">Value</label>
                                        <input
                                            {...register(`details.${index}.value` as const)}
                                            className="w-full border rounded-lg px-2 py-1 text-xs"
                                        />
                                    </div>

                                    <div className="col-span-4">
                                        <label className="block text-xs font-medium mb-1">
                                            Description
                                        </label>
                                        <input
                                            {...register(`details.${index}.description` as const)}
                                            className="w-full border rounded-lg px-2 py-1 text-xs"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="col-span-1 text-red-600 hover:text-red-700 text-xs"
                                    >
                                        <Trash className="w-4 h-4 inline" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {errors.details && !Array.isArray(errors.details) && (
                            <p className="text-red-600 text-xs mt-2">At least one detail is required.</p>
                        )}

                        <button
                            type="button"
                            onClick={() =>
                                append({ name: "", unit: "", value: "", description: "" })
                            }
                            className="mt-4 inline-flex items-center space-x-1 text-blue-600 text-sm hover:text-blue-700"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Detail</span>
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-2xl font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Loading..." : "Submit"}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}
