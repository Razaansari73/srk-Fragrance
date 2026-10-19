import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Breadcrumbs, EmptyState, ProductGrid } from "../components/Common.jsx";
import {
  discountFor,
  findProduct,
  formatPrice,
  products,
} from "../data/products.jsx";
import { useStore } from "../store/StoreContext.jsx";
import { productService } from "../services/productService.js";

function Gallery({ product }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [touch, setTouch] = useState(0);
  const select = (next) =>
    setIndex((next + product.gallery.length) % product.gallery.length);
  useEffect(() => {
    document.body.classList.toggle("overlay-open", open);
    const key = (event) => {
      if (!open) return;
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowLeft")
        setIndex(
          (value) =>
            (value - 1 + product.gallery.length) % product.gallery.length,
        );
      if (event.key === "ArrowRight")
        setIndex((value) => (value + 1) % product.gallery.length);
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      document.body.classList.remove("overlay-open");
    };
  }, [open, product.gallery.length]);
  return (
    <>
      <div>
        <button
          className="product-gallery-main"
          aria-label="Open full-screen image viewer"
          onClick={() => setOpen(true)}
        >
          <img src={product.gallery[index]} alt={product.name} />
          <span className="zoom-hint">Click to enlarge</span>
        </button>
        <div className="gallery-thumbs" aria-label="Product images">
          {product.gallery.map((image, i) => (
            <button
              key={image}
              className={i === index ? "is-active" : ""}
              onClick={() => setIndex(i)}
              aria-label={`View image ${i + 1}`}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      </div>
      <div
        className={`lightbox${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Product image viewer"
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        onTouchStart={(e) => setTouch(e.changedTouches[0].clientX)}
        onTouchEnd={(e) => {
          const distance = e.changedTouches[0].clientX - touch;
          if (Math.abs(distance) > 40) select(index + (distance < 0 ? 1 : -1));
        }}
      >
        <button
          className="lightbox-close"
          aria-label="Close image viewer"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        <button
          className="lightbox-prev"
          aria-label="Previous image"
          onClick={() => select(index - 1)}
        >
          ←
        </button>
        <img
          src={product.gallery[index]}
          alt={`${product.name}, image ${index + 1}`}
        />
        <button
          className="lightbox-next"
          aria-label="Next image"
          onClick={() => select(index + 1)}
        >
          →
        </button>
      </div>
    </>
  );
}


export default function ProductPage() {
  const [params] = useSearchParams();
  const productId = params.get("id");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { addToCart, isFavorite, toggleFavorite } = useStore();

  // Fetch selected product from backend
  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      setProduct(null);
      setQuantity(1);

      try {
        if (!productId) {
          throw new Error("Product ID is missing.");
        }

        const data = await productService.getProductById(productId);

        if (!cancelled) {
          setProduct(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load product.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  // Update browser title
  useEffect(() => {
    document.title = product
      ? `${product.name} — SRK Fragrance`
      : "Product — SRK Fragrance";
  }, [product]);

  // Loading state
  if (loading) {
    return (
      <main id="main" className="section">
        <div className="container">
          <p>Loading product details...</p>
        </div>
      </main>
    );
  }

  // Product not found or API error
  if (!product) {
    return (
      <main id="main" className="section">
        <div className="container">
          <EmptyState
            title="Fragrance not found"
            message={
              error ||
              "The product link may be incomplete or no longer available."
            }
            action="Explore collection"
            to="/arrival"
          />
        </div>
      </main>
    );
  }

  // Related products - existing frontend catalog
  const related = products
    .filter(
      (item) =>
        item.id !== product.id &&
        (item.category === product.category || item.isFeatured)
    )
    .slice(0, 4);

  const hasDiscount =
    product.originalPrice != null &&
    product.originalPrice > product.price;

  return (
    <main id="main" className="section">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: "Collection", to: "/arrival" },
            { label: product.name },
          ]}
        />

        <div className="product-detail">
          {/* Backend product image */}
          {product.gallery?.length > 0 ? (
            <Gallery key={product.id} product={product} />
          ) : (
            <div className="product-gallery-main">
              <p>Product image not available</p>
            </div>
          )}

          <div className="product-detail-copy">
            <p className="eyebrow">{product.category}</p>

            <h1>{product.name}</h1>

            {/* Rating */}
            {product.rating != null && (
              <div
                className="rating"
                aria-label={`Rated ${product.rating} out of 5`}
              >
                ★★★★★ <span>{product.rating} / 5</span>
              </div>
            )}

            {/* Product price */}
            <div className="detail-price">
              <strong>{formatPrice(product.price)}</strong>

              {hasDiscount && (
                <>
                  <s>{formatPrice(product.originalPrice)}</s>
                  <span>Save {discountFor(product)}%</span>
                </>
              )}
            </div>

            {/* Backend description */}
            <p className="detail-description">
              {product.description}
            </p>

            <p className="detail-size">
              <strong>Size:</strong> {product.size}
            </p>

            {/* Purchase actions */}
            <div className="purchase-row">
              <div className="quantity">
                <button
                  aria-label="Decrease quantity"
                  onClick={() =>
                    setQuantity((value) => Math.max(1, value - 1))
                  }
                >
                  −
                </button>

                <input
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(1, Number(e.target.value) || 1)
                    )
                  }
                  inputMode="numeric"
                  aria-label="Quantity"
                />

                <button
                  aria-label="Increase quantity"
                  onClick={() =>
                    setQuantity((value) => value + 1)
                  }
                >
                  +
                </button>
              </div>

              <button
                className="button button-dark"
                onClick={() => addToCart(product.id, quantity)}
              >
                Add to cart
              </button>

              <button
                className={`detail-favorite${
                  isFavorite(product.id) ? " is-active" : ""
                }`}
                onClick={() => toggleFavorite(product.id)}
                aria-label="Toggle favorite"
                aria-pressed={isFavorite(product.id)}
              >
                ♡
              </button>
            </div>

            {/* Product information */}
            <div className="detail-accordions">
              <details open>
                <summary>Product information</summary>
                <p>
                  A premium {product.category?.toLowerCase()} presented in{" "}
                  {product.size}. Store in a cool, dry place away from
                  direct sunlight.
                </p>
              </details>

              <details>
                <summary>Delivery information</summary>
                <p>
                  Complimentary standard delivery on orders above ₹999.
                  Delivery times are shown before checkout.
                </p>
              </details>

              <details>
                <summary>Returns information</summary>
                <p>
                  Unopened products may be returned within 7 days of
                  delivery.{" "}
                  <Link to="/contact">Contact us</Link> and we will guide
                  you through the process.
                </p>
              </details>
            </div>
          </div>
        </div>

        {/* Related products */}
        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">You may also enjoy</p>
              <h2>Discover more</h2>
            </div>
          </div>

          <ProductGrid products={related} />
        </section>
      </div>
    </main>
  );
}

