"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import { categoryApi } from "@/lib/category-api";
import { getErrorMessage } from "@/lib/error-handler";
import { Category } from "@/src/api";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryApi.getCategories(true);

      // 检查响应结构
      if (response && typeof response === "object" && "data" in response) {
        const data = (response as { data?: Category[] }).data;
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } else if (Array.isArray(response)) {
        setCategories(response);
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "获取分类列表失败");
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    refetch: fetchCategories,
  };
};
