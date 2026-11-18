const sanitizeHtml = require("sanitize-html");

const validateProductInput = (input) => {
  const description = typeof input.description === "string"
    ? input.description.trim()
    : "";

  const values = {
    title: typeof input.title === "string" ? input.title.trim() : "",
    description: sanitizeHtml(description, {
      allowedTags: [
        "p", "br", "b", "i", "u", "s", "strong", "em", "strike",
        "blockquote", "h1", "h2", "h3", "h4", "h5", "h6",
        "ul", "ol", "li", "a", "span", "div", "img", "table",
        "thead", "tbody", "tfoot", "tr", "th", "td", "sub", "sup",
        "pre", "code"
      ],
      allowedAttributes: {
        "*": ["style", "class"],
        "a": ["href", "target", "rel"],
        "img": ["src", "alt", "width", "height"]
      },
      allowedStyles: {
        "*": {
          "color": [/^#[0-9a-f]{3,8}$/i, /^[a-z]+$/i],
          "background-color": [/^#[0-9a-f]{3,8}$/i, /^[a-z]+$/i],
          "text-align": [/^(left|center|right|justify)$/],
          "font-size": [/^[0-9]{1,3}(px|em|rem|%)$/],
          "text-decoration": [/^[a-z -]+$/i]
        }
      },
      allowedSchemes: ["http", "https", "mailto"],
      allowedSchemesByTag: {
        img: ["http", "https", "data"]
      }
    }),
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
