"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Button, Typography, message, Card, ConfigProvider } from "antd";
import { ArrowLeftOutlined, HomeOutlined } from "@ant-design/icons";
import VotingBasicInfo from "@/components/votings/create/VotingBasicInfo";
import VotingProductList from "@/components/votings/create/VotingProductList";
import type { ProductItem, ParameterRow } from "./types";
import { AdminVotingService } from "@/src/api/services/AdminVotingService";
import { uploadApi } from "@/lib/uploadApi";

const { Title } = Typography;

export default function CreateVotingPage() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [hasBonus, setHasBonus] = useState(false);
    const [products, setProducts] = useState<ProductItem[]>([
        {
            id: crypto.randomUUID(),
            name: "",
            description: "",
            image: "",
        },
        {
            id: crypto.randomUUID(),
            name: "",
            description: "",
            image: "",
        },
    ]);
    const [parameters, setParameters] = useState<ParameterRow[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, { name?: boolean; image?: boolean }>>({});

    // --- Product & Parameter Handlers ---
    const addProduct = () => {
        const newProduct: ProductItem = {
            id: crypto.randomUUID(),
            name: "",
            description: "",
            image: "",
        };
        setParameters(
            parameters.map((param) => ({
                ...param,
                values: { ...param.values, [newProduct.id]: "" },
            }))
        );
        setProducts([...products, newProduct]);
    };

    const removeProduct = (id: string) => {
        setProducts(products.filter((p) => p.id !== id));
        setParameters(
            parameters.map((param) => {
                const newValues = { ...param.values };
                delete newValues[id];
                return { ...param, values: newValues };
            })
        );
    };

    const updateProduct = (
        id: string,
        field: keyof ProductItem,
        value: string
    ) => {
        setProducts(
            products.map((p) => (p.id === id ? { ...p, [field]: value } : p))
        );
    };

    const addParameter = () => {
        if (products.length === 0) {
            message.warning("请先添加至少一个选项");
            return;
        }
        const newParam: ParameterRow = {
            id: crypto.randomUUID(),
            name: "",
            values: products.reduce((acc, p) => ({ ...acc, [p.id]: "" }), {}),
        };
        setParameters([...parameters, newParam]);
    };

    const removeParameter = (id: string) => {
        setParameters(parameters.filter((p) => p.id !== id));
    };

    const updateParameterName = (id: string, name: string) => {
        setParameters(parameters.map((p) => (p.id === id ? { ...p, name } : p)));
    };

    const updateParameterValue = (
        paramId: string,
        productId: string,
        value: string
    ) => {
        setParameters(
            parameters.map((p) =>
                p.id === paramId
                    ? { ...p, values: { ...p.values, [productId]: value } }
                    : p
            )
        );
    };

    // Helper to upload a blob URL
    const uploadBlobUrl = async (blobUrl: string): Promise<string> => {
        if (!blobUrl || !blobUrl.startsWith("blob:")) return blobUrl;

        try {
            const response = await fetch(blobUrl);
            const blob = await response.blob();
            // Need to convert blob to File to preserve filename if possible, or just pass blob
            const file = new File([blob], "image.jpg", { type: blob.type });
            return await uploadApi.uploadImage(file);
        } catch (e) {
            console.error("Failed to upload image", e);
            throw new Error("图片上传失败");
        }
    };

    const handleSubmit = async () => {
        try {
            const formValues = await form.validateFields();

            // Validate minimum products
            if (products.length < 2) {
                message.warning("请至少添加2个选项进行对比");
                return;
            }

            // Validate product fields (name and image)
            const errors: Record<string, { name?: boolean; image?: boolean }> = {};
            let hasError = false;

            products.forEach((p) => {
                const productErrors: { name?: boolean; image?: boolean } = {};
                if (!p.name?.trim()) {
                    productErrors.name = true;
                    hasError = true;
                }
                if (!p.image) {
                    productErrors.image = true;
                    hasError = true;
                }
                if (Object.keys(productErrors).length > 0) {
                    errors[p.id] = productErrors;
                }
            });

            if (hasError) {
                setValidationErrors(errors);
                message.error("请完善所有选项的必填信息 (名称和图片)");
                const productListElement = document.getElementById("voting-product-list");
                if (productListElement) {
                    productListElement.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                return;
            }

            // Clear errors if valid
            setValidationErrors({});
            setSubmitting(true);

            // 1. Upload images in parallel
            const productImagesMap = new Map<string, string>();
            await Promise.all(
                products.map(async (p) => {
                    if (p.image) {
                        const url = await uploadBlobUrl(p.image);
                        productImagesMap.set(p.id, url);
                    }
                })
            );

            // 2. Prepare items with specs and R2 URLs
            const items = products.map((product) => {
                const specs: Record<string, string> = {};
                parameters.forEach((param) => {
                    if (param.name && param.values[product.id]) {
                        specs[param.name] = param.values[product.id];
                    }
                });

                const remoteImageUrl = productImagesMap.get(product.id) || "";

                return {
                    itemId: product.id,
                    name: product.name,
                    description: product.description,
                    images: remoteImageUrl ? [remoteImageUrl] : [],
                    primaryImageUrl: remoteImageUrl,
                    specs,
                };
            });

            // 3. Prepare payload
            const payload = {
                createUserId: formValues.createUserId, // Admin specific
                title: formValues.title,
                description: formValues.description,
                category: {
                    main: formValues.categoryPath?.[0],
                    sub: formValues.categoryPath?.[1] || "general",
                },
                items,
                parameters: parameters.map((p) => p.name).filter(Boolean),
                startTime: formValues.dateRange?.[0]?.toISOString() || new Date().toISOString(),
                endTime: formValues.dateRange?.[1]?.toISOString(),
                hasBonus: hasBonus,
                // bonusDescription: hasBonus ? formValues.bonus : undefined,
                allowGuestVotes: true,
                tags: []
            };

            await AdminVotingService.postApiV1AdminVotings(payload);

            message.success("投票创建成功！");
            router.push("/dashboard/votings");
        } catch (error) {
            console.error(error);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            message.error((error as any)?.message || "创建失败，请检查表单或网络");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#f43f5e", // Rose-500
                    borderRadius: 8,
                },
            }}
        >
            <div className="min-h-screen bg-gray-50/30">
                {/* Header / Breadcrumb area */}
                <div className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span
                                onClick={() => router.push("/dashboard/votings")}
                                className="cursor-pointer hover:text-rose-500 transition-colors flex items-center gap-1"
                            >
                                <HomeOutlined />
                                投票管理
                            </span>
                            <span>›</span>
                            <span className="text-gray-900 font-medium">创建投票</span>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 max-w-5xl">
                    <div className="flex items-center justify-between mb-8">
                        <Title level={2} style={{ margin: 0 }}>创建新投票</Title>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        className="flex flex-col gap-y-6"
                    >
                        {/* We pass components as children or just render them */}
                        <VotingBasicInfo hasBonus={hasBonus} setHasBonus={setHasBonus} />

                        <VotingProductList
                            products={products}
                            parameters={parameters}
                            addProduct={addProduct}
                            removeProduct={removeProduct}
                            updateProduct={updateProduct}
                            addParameter={addParameter}
                            removeParameter={removeParameter}
                            updateParameterName={updateParameterName}
                            updateParameterValue={updateParameterValue}
                            validationErrors={validationErrors}
                        />

                        {/* Submit Actions */}
                        <div className="flex items-center justify-end gap-4 mt-4">
                            <Button size="large" onClick={() => router.back()}>
                                取消
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={submitting}
                                className="px-8 bg-rose-500 hover:bg-rose-600 border-none shadow-md shadow-rose-500/20"
                            >
                                创建投票
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </ConfigProvider>
    );
}
