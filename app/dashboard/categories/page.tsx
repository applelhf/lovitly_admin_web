"use client";

import React from "react";
import CategoryList from "@/components/categories/CategoryList";
import { useCategories } from "@/hooks/categories/useCategories";

export default function CategoriesPage() {
  const { categories, loading, refetch } = useCategories();

  return (
    <div>
      <CategoryList
        categories={categories}
        loading={loading}
        onRefresh={refetch}
      />
    </div>
  );
}
