import { products as catalogProducts } from "../data/products.jsx";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_AUTH_API_BASE_URL ||
  ""
).replace(/\/$/, "");

// Convert backend image path into full URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return "";

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  return `${API_BASE}/${imagePath.replace(/^\/+/, "")}`;
};

const mapProduct = (product) => {
  const catalogProduct = catalogProducts.find(
    (item) => item.id === Number(product.id)
  );

  return {
    ...catalogProduct,

    id: Number(product.id),
    name: product.name,
    price: Number(product.price),
    originalPrice: Number(product.original_price),

    // Always use image received from backend
    image: getImageUrl(product.image),

    category: product.category,
    size: product.size,
    isFeatured: Number(product.is_featured) === 1,
  };
};

export const productService = {
  async getFeaturedProducts() {
    if (!API_BASE) {
      throw new Error("Product API is not configured.");
    }

    const response = await fetch(`${API_BASE}/api/products`);
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        payload.message || "Unable to load products."
      );
    }

    return Array.isArray(payload.data)
      ? payload.data
          .filter(
            (product) => Number(product.is_featured) === 1
          )
          .map(mapProduct)
      : [];
  },
};8