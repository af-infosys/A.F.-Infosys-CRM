// modules/income-category/incomeCategory.controller.js
import { IncomeCategoryService } from "./incomeCategory.service.js";
import {
  validateCreateCategory,
  validateUpdateCategory,
  validatePatchStatus,
} from "./incomeCategory.validation.js";

const handleServiceError = (res, error) => {
  if (error.isNotFound) {
    return res.status(404).json({ success: false, message: error.message });
  }
  if (error.isConflict) {
    return res.status(409).json({ success: false, message: error.message });
  }
  console.error("[IncomeCategory Controller Error]:", error);
  return res
    .status(500)
    .json({ success: false, message: "Internal Server Error." });
};

export const getIncomeCategories = async (req, res) => {
  try {
    const statusFilter = req.query.status
      ? req.query.status.toUpperCase()
      : "ACTIVE";

    const categories = await IncomeCategoryService.getCategories(statusFilter);

    return res.status(200).json({
      success: true,
      message: "Income categories retrieved successfully.",
      data: categories,
    });
  } catch (error) {
    return handleServiceError(res, error);
  }
};

export const getIncomeCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await IncomeCategoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Income category retrieved successfully.",
      data: category,
    });
  } catch (error) {
    return handleServiceError(res, error);
  }
};

export const createIncomeCategory = async (req, res) => {
  try {
    const { error, value } = validateCreateCategory(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const newCategory = await IncomeCategoryService.createCategory(value);

    return res.status(201).json({
      success: true,
      message: "Income category created successfully.",
      data: newCategory,
    });
  } catch (error) {
    return handleServiceError(res, error);
  }
};

export const updateIncomeCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = validateUpdateCategory(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const updatedCategory = await IncomeCategoryService.updateCategory(
      id,
      value,
    );

    return res.status(200).json({
      success: true,
      message: "Income category updated successfully.",
      data: updatedCategory,
    });
  } catch (error) {
    return handleServiceError(res, error);
  }
};

export const patchIncomeCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = validatePatchStatus(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const updatedCategory = await IncomeCategoryService.patchCategoryStatus(
      id,
      value.status,
    );

    return res.status(200).json({
      success: true,
      message: "Income category status updated successfully.",
      data: updatedCategory,
    });
  } catch (error) {
    return handleServiceError(res, error);
  }
};
