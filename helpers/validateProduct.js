const validateProductInput = (input) => {
  const values = {
    title: typeof input.title === "string" ? input.title.trim() : "",
    description: typeof input.description === "string" ? input.description.trim() : "",
    price: input.price === "" || input.price === undefined ? 0 : Number(input.price),
    discountPercentage: input.discountPercentage === "" || input.discountPercentage === undefined
      ? 0
      : Number(input.discountPercentage),
    stock: input.stock === "" || input.stock === undefined ? 0 : Number(input.stock),
    position: input.position === "" || input.position === undefined ? null : Number(input.position),
    status: input.status || "active"
  };
  const errors = [];

  if (!values.title) {
    errors.push("Product title is required.");
  } else if (values.title.length > 120) {
    errors.push("Product title must be 120 characters or fewer.");
  }
  if (!Number.isFinite(values.price) || values.price < 0) {
    errors.push("Price must be a non-negative number.");
  }
  if (!Number.isFinite(values.discountPercentage) || values.discountPercentage < 0 || values.discountPercentage > 100) {
    errors.push("Discount percentage must be between 0 and 100.");
  }
  if (!Number.isInteger(values.stock) || values.stock < 0) {
    errors.push("Stock must be a non-negative whole number.");
  }
  if (values.position !== null && (!Number.isInteger(values.position) || values.position < 1)) {
    errors.push("Position must be a positive whole number.");
  }
  if (!["active", "inactive"].includes(values.status)) {
    errors.push("Status must be active or inactive.");
  }

  return { values, errors };
};

module.exports = validateProductInput;
