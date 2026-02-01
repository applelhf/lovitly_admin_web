"use client";

import React, { useState } from "react";
import {
    Card,
    Typography,
    Button,
    Input,
    Upload,
    message,
    Row,
    Col,
    Table,
} from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    UploadOutlined,
    ColumnWidthOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import type { ProductItem, ParameterRow } from "@/app/dashboard/votings/create/types";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface VotingProductListProps {
    products: ProductItem[];
    parameters: ParameterRow[];
    addProduct: () => void;
    removeProduct: (id: string) => void;
    updateProduct: (id: string, field: keyof ProductItem, value: string) => void;
    addParameter: () => void;
    removeParameter: (id: string) => void;
    updateParameterName: (id: string, name: string) => void;
    updateParameterValue: (paramId: string, productId: string, value: string) => void;
    validationErrors: Record<string, { name?: boolean; image?: boolean }>;
}

export default function VotingProductList({
    products,
    parameters,
    addProduct,
    removeProduct,
    updateProduct,
    addParameter,
    removeParameter,
    updateParameterName,
    updateParameterValue,
    validationErrors,
}: VotingProductListProps) {
    // Helper to handle image upload
    const handleImageUpload = (file: File, productId: string) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error("You can only upload image files!");
            return Upload.LIST_IGNORE;
        }

        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
            message.error("Image must be smaller than 5MB!");
            return Upload.LIST_IGNORE;
        }

        const blobUrl = URL.createObjectURL(file);
        updateProduct(productId, "image", blobUrl);
        return false; // Prevent auto upload
    };

    const COLUMN_WIDTH = "w-[320px]";
    const LABEL_WIDTH = "w-[200px]";
    const GAP = "gap-4";
    const MR = "mr-4";

    return (
        <Card className="border border-gray-200 shadow-sm overflow-hidden rounded-xl" id="voting-product-list">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <div>
                    <Title level={4} className="mb-0 !text-gray-800">
                        投票选项与参数
                    </Title>
                    <Text type="secondary" className="text-sm">
                        管理选项及其详细对比参数
                    </Text>
                </div>
                <div className="flex gap-2">
                    <Button
                        icon={<ColumnWidthOutlined />}
                        onClick={addParameter}
                        className="text-gray-600 hover:text-rose-500 hover:border-rose-500"
                    >
                        添加参数行
                    </Button>
                    <Button
                        type="dashed"
                        onClick={addProduct}
                        icon={<PlusOutlined />}
                        className="border-rose-300 text-rose-500 hover:!border-rose-500 hover:!text-rose-600 bg-rose-50/50"
                    >
                        添加选项
                    </Button>
                </div>
            </div>

            {/* Unified Scrolling Container */}
            <div className="overflow-x-auto pb-6">
                <div className="min-w-max px-1">

                    {/* 1. Header Row (Product Cards) */}
                    <div className="flex items-start mb-6">
                        {/* Validation/Label Column Placeholder - Empty or Summary */}
                        <div className={`${LABEL_WIDTH} flex-shrink-0 pt-2 mr-4`}>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 h-full flex flex-col justify-center text-gray-500 text-sm">
                                <p className="mb-2 font-medium">布局说明:</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>横向排列所有选项</li>
                                    <li>纵向添加对比参数</li>
                                    <li>保持列对齐填写</li>
                                </ul>
                            </div>
                        </div>

                        {/* Product Cards Columns */}
                        {products.map((product, index) => (
                            <div key={product.id} className={`${COLUMN_WIDTH} flex-shrink-0 ${MR}`}>
                                <Card
                                    className={`shadow-sm border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md h-full ${validationErrors[product.id] ? "border-red-500 ring-2 ring-red-100" : "border-gray-200"
                                        }`}
                                    title={
                                        <div className="flex items-center gap-2">
                                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">#{index + 1}</span>
                                            <span className="text-gray-700">选项详情</span>
                                        </div>
                                    }
                                    extra={
                                        products.length > 2 && (
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => removeProduct(product.id)}
                                                className="hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center p-0"
                                            />
                                        )
                                    }
                                    size="small"
                                    headStyle={{ borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa', fontSize: '14px' }}
                                    bodyStyle={{ padding: '12px' }}
                                >
                                    {/* Image Upload */}
                                    <div className="mb-3 text-center group">
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            className={`avatar-uploader w-full aspect-video [&>.ant-upload]:!w-full [&>.ant-upload]:!h-32 [&>.ant-upload]:!bg-gray-50 [&>.ant-upload]:!border-dashed [&>.ant-upload]:!border-gray-300 ${validationErrors[product.id]?.image ? "[&>.ant-upload]:!border-red-400 [&>.ant-upload]:!bg-red-50" : ""
                                                }`}
                                            showUploadList={false}
                                            beforeUpload={(file) => handleImageUpload(file, product.id)}
                                        >
                                            {product.image ? (
                                                <div className="relative w-full h-full overflow-hidden rounded-lg group-hover:opacity-90 transition-opacity">
                                                    <img
                                                        src={product.image}
                                                        alt="product"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <div className="bg-white/90 p-2 rounded-full shadow-lg">
                                                            <UploadOutlined className="text-gray-700 text-lg" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <div className={`p-2 rounded-full mb-1 ${validationErrors[product.id]?.image ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-400 group-hover:text-rose-500 group-hover:bg-rose-50 transition-colors"}`}>
                                                        <UploadOutlined className="text-lg" />
                                                    </div>
                                                    <div className={validationErrors[product.id]?.image ? "text-red-500 text-xs font-medium" : "group-hover:text-gray-600 transition-colors text-xs"}>
                                                        上传图片
                                                    </div>
                                                </div>
                                            )}
                                        </Upload>
                                    </div>

                                    {/* Name Input */}
                                    <div className="mb-2">
                                        <Input
                                            placeholder="选项名称 (必填)"
                                            value={product.name}
                                            onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                                            status={validationErrors[product.id]?.name ? "error" : ""}
                                            className="rounded-lg text-sm"
                                        />
                                    </div>

                                    {/* Description Input */}
                                    <div>
                                        <TextArea
                                            placeholder="描述 (可选)..."
                                            value={product.description}
                                            onChange={(e) => updateProduct(product.id, "description", e.target.value)}
                                            rows={2}
                                            className="resize-none rounded-lg text-xs"
                                        />
                                    </div>
                                </Card>
                            </div>
                        ))}

                        {/* Add Button Column */}
                        <div className="w-[120px] flex-shrink-0">
                            <div
                                className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-rose-400 hover:bg-rose-50/30 text-gray-400 hover:text-rose-500 transition-all duration-300 group"
                                onClick={addProduct}
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-white group-hover:shadow-md border border-gray-100 group-hover:border-rose-200 flex items-center justify-center mb-3 transition-all">
                                    <PlusOutlined style={{ fontSize: 20 }} />
                                </div>
                                <div className="font-medium">添加选项</div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Parameters Rows Header (Optional or implied) */}
                    {parameters.length > 0 && (
                        <div className="flex items-center mb-2 pb-2 border-b border-gray-100">
                            <div className={`${LABEL_WIDTH} flex-shrink-0 mr-4 font-semibold text-gray-600 pl-2`}>
                                参数名称
                            </div>
                            {products.map(p => (
                                <div key={p.id} className={`${COLUMN_WIDTH} flex-shrink-0 ${MR} text-xs text-gray-400 pl-1`}>
                                    {p.name || "(未命名)"} - 对比值
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 3. Parameter Rows */}
                    <div className="flex flex-col gap-3">
                        {parameters.map((param, index) => (
                            <div key={param.id} className="flex items-start group hover:bg-gray-50/50 p-2 rounded-lg -mx-2 transition-colors">
                                {/* Parameter Name Input */}
                                <div className={`${LABEL_WIDTH} flex-shrink-0 mr-4 pt-1`}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-300 text-xs w-5 text-right flex-shrink-0">#{index + 1}</span>
                                        <Input
                                            placeholder="参数名 (如: 价格)"
                                            value={param.name}
                                            onChange={(e) => updateParameterName(param.id, e.target.value)}
                                            className="rounded-lg bg-gray-50 focus:bg-white border-gray-200"
                                        />
                                    </div>
                                </div>

                                {/* Parameter Values (aligned with products) */}
                                {products.map((p) => (
                                    <div key={p.id} className={`${COLUMN_WIDTH} flex-shrink-0 ${MR}`}>
                                        <Input
                                            placeholder={`${param.name ? param.name + " " : ""}对比值`}
                                            value={param.values[p.id] || ""}
                                            onChange={(e) => updateParameterValue(param.id, p.id, e.target.value)}
                                            className="rounded-lg border-gray-200"
                                        />
                                    </div>
                                ))}

                                {/* Actions */}
                                <div className="w-[120px] flex-shrink-0 pt-1">
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeParameter(param.id)}
                                        className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                                    >
                                        删除
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State for Parameters */}
                    {parameters.length === 0 && (
                        <div
                            className="mt-4 border border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50/30 hover:bg-gray-50/80 transition-colors cursor-pointer"
                            onClick={addParameter}
                        >
                            <ColumnWidthOutlined className="text-2xl text-gray-300 mb-2" />
                            <div className="text-gray-500 font-medium">暂无对比参数</div>
                            <div className="text-xs text-gray-400 mt-1">点击右上角"添加参数行"开始对比</div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
