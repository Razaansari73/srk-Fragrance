import { products as catalogProducts } from "../data/products.jsx";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_AUTH_API_BASE_URL ||
  ""
).replace(/\/+$/, "");

// Backend image path ko full URL mein convert karega
const getImageUrl = (imagePath) => {
  if (!imagePath) return "";

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  return `${API_BASE}/${imagePath.replace(/^\/+/, "")}`;
};

// Backend product ko frontend format mein convert karega
const mapProduct = (product) => {
  const catalogProduct = catalogProducts.find(
    (item) => item.id === Number(product.id)
  );

  const backendImage = getImageUrl(product.image);

  return {
    ...catalogProduct,

    id: Number(product.id),
    name: product.name,
    category: product.category,
    description: product.description,
    price: Number(product.price),
    originalPrice:
      product.original_price == null
        ? null
        : Number(product.original_price),

    size: product.size,
    stock: product.stock,
    isFeatured: Number(product.is_featured) === 1,

    // Backend image
    image: backendImage,

    // Backend image used in Product Detail gallery
    gallery: backendImage ? [backendImage] : [],
  };
};

export const productService = {
  // Homepage - Signature Collection
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

  // Product Detail Page - Single Product
  async getProductById(id) {
    if (!API_BASE) {
      throw new Error("Product API is not configured.");
    }

    const response = await fetch(
      `${API_BASE}/api/products/${encodeURIComponent(id)}`
    );

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        payload.message || "Product not found."
      );
    }

    return mapProduct(payload.data);
  },
};