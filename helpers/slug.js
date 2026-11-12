const slugify = (value) => {
  const slug = String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "product";
};

const createUniqueSlug = async (Model, value) => {
  const baseSlug = slugify(value);
  let slug = baseSlug;
  let suffix = 2;

  while (await Model.exists({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
};

module.exports = {
  createUniqueSlug,
  slugify
};
