// modules/income-category/incomeCategory.service.js
import { v4 as uuidv4 } from "uuid";
import { GoogleSheetService } from "../../utils/GoogleSheetService.js"; // Adjust path to your actual location

const sheetService = new GoogleSheetService();
const ENTITY = "IncomeCategory";
const STATUS_ACTIVE = "ACTIVE";
const STATUS_ALL = "ALL";

export class IncomeCategoryService {
  /**
   * Helper to check if a category with the same name exists (case insensitive)
   */
  static async checkNameExists(name, excludeId = null) {
    const allCategories = await sheetService.read(ENTITY);
    const lowerName = name.toLowerCase();

    return allCategories.find(
      (cat) => cat.name.toLowerCase() === lowerName && cat._id !== excludeId,
    );
  }

  static async getCategories(statusFilter = STATUS_ACTIVE) {
    const categories = await sheetService.read(ENTITY);

    if (statusFilter === STATUS_ALL) {
      return categories;
    }

    return categories.filter((cat) => cat.status === statusFilter);
  }

  static async getCategoryById(id) {
    const category = await sheetService.findById(ENTITY, id);

    // The provided findById returns an empty array if not found
    if (Array.isArray(category) && category.length === 0) {
      return null;
    }
    return category;
  }

  static async createCategory(data) {
    const isDuplicate = await this.checkNameExists(data.name);
    if (isDuplicate) {
      const error = new Error("Category name already exists.");
      error.isConflict = true;
      throw error;
    }

    const _id = uuidv4();
    const status = STATUS_ACTIVE;

    // Ordered as per: [_id, name, icon, color, status]
    const values = [_id, data.name, data.icon, data.color, status];

    return await sheetService.insert(ENTITY, values);
  }

  static async updateCategory(id, data) {
    const existingCategory = await this.getCategoryById(id);
    if (!existingCategory) {
      const error = new Error("Category not found.");
      error.isNotFound = true;
      throw error;
    }

    const isDuplicate = await this.checkNameExists(data.name, id);
    if (isDuplicate) {
      const error = new Error("Category name already exists.");
      error.isConflict = true;
      throw error;
    }

    // Ordered WITHOUT _id as per requirement: [name, icon, color, status]
    const values = [data.name, data.icon, data.color, data.status];
    return await sheetService.updateById(ENTITY, id, values);
  }

  static async patchCategoryStatus(id, status) {
    const existingCategory = await this.getCategoryById(id);
    if (!existingCategory) {
      const error = new Error("Category not found.");
      error.isNotFound = true;
      throw error;
    }

    // Preserve existing fields, update only status
    const values = [
      existingCategory.name,
      existingCategory.icon,
      existingCategory.color,
      status,
    ];

    return await sheetService.updateById(ENTITY, id, values);
  }
}
