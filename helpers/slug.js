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

const createUniqueSlug = async (Model, value, excludeId) => {
  const baseSlug = slugify(value);
  let slug = baseSlug;
  let suffix = 2;
  const query = excludeId ? { slug, _id: { $ne: excludeId } } : { slug };

  while (await Model.exists(query)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
    query.slug = slug;
  }

  return slug;
};

module.exports = {
  createUniqueSlug,
  slugify
};
