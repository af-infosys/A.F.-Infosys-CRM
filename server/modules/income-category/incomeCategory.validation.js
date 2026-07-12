// modules/income-category/incomeCategory.validation.js

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export const validateCreateCategory = (data) => {
  const { name, icon, color } = data;

  if (!name || typeof name !== "string") {
    return { error: "Name is required and must be a string." };
  }

  const trimmedName = name.trim();
  if (trimmedName.length < 3 || trimmedName.length > 50) {
    return { error: "Name must be between 3 and 50 characters." };
  }

  if (!icon || typeof icon !== "string" || !icon.trim()) {
    return { error: "Icon is required." };
  }

  if (
    !color ||
    typeof color !== "string" ||
    !HEX_COLOR_REGEX.test(color.trim())
  ) {
    return {
      error: "Color is required and must be a valid HEX color (e.g., #22C55E).",
    };
  }

  return {
    error: null,
    value: {
      name: trimmedName,
      icon: icon.trim(),
      color: color.trim().toUpperCase(),
    },
  };
};

export const validateUpdateCategory = (data) => {
  const { name, icon, color, status } = data;
  const validated = validateCreateCategory({ name, icon, color });

  if (validated.error) {
    return validated;
  }

  if (status && status !== STATUS_ACTIVE && status !== STATUS_INACTIVE) {
    return { error: "Status must be either ACTIVE or INACTIVE." };
  }

  return {
    error: null,
    value: {
      ...validated.value,
      status: status || STATUS_ACTIVE,
    },
  };
};

export const validatePatchStatus = (data) => {
  const { status } = data;

  if (status !== STATUS_ACTIVE && status !== STATUS_INACTIVE) {
    return { error: "Status must be either ACTIVE or INACTIVE." };
  }

  return { error: null, value: { status } };
};
