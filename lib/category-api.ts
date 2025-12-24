import { CategoriesService, Category } from "@/src/api";
import "@/lib/api-config";

export const categoryApi = {
  // 获取所有分类
  getCategories: async (expand: boolean = false) => {
    return CategoriesService.getApiV1AdminCategories(expand);
  },

  // 获取单个分类
  getCategory: async (key: string) => {
    return CategoriesService.getApiV1AdminCategories1(key);
  },

  // 创建分类
  createCategory: async (data: Category) => {
    return CategoriesService.postApiV1AdminCategories(data);
  },

  // 更新分类
  updateCategory: async (key: string, data: Category) => {
    return CategoriesService.putApiV1AdminCategories(key, data);
  },

  // 删除分类
  deleteCategory: async (key: string) => {
    return CategoriesService.deleteApiV1AdminCategories(key);
  },

  // 批量导入分类
  importCategories: async (data: Array<Category>) => {
    return CategoriesService.postApiV1AdminCategoriesImport(data);
  },

  // 删除所有分类
  deleteAllCategories: async () => {
    return CategoriesService.deleteApiV1AdminCategoriesAll();
  },
};
