import apiPath from "../../../isProduction";

const ENDPOINT = `${await apiPath()}/api/account/income-category`;

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "An unexpected error occurred");
  }
  return data.data;
};

export const IncomeCategoryService = {
  async getCategories(status = "ACTIVE") {
    const response = await fetch(`${ENDPOINT}?status=${status}`);
    return handleResponse(response);
  },

  async createCategory(categoryData) {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryData),
    });
    return handleResponse(response);
  },

  async updateCategory(id, categoryData) {
    const response = await fetch(`${ENDPOINT}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryData),
    });
    return handleResponse(response);
  },

  async toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const response = await fetch(`${ENDPOINT}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    return handleResponse(response);
  },
};
