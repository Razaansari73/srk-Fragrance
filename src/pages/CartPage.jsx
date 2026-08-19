import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState, PageHero } from "../components/Common.jsx";
import { findProduct, formatPrice } from "../data/products.jsx";
import { useStore } from "../store/StoreContext.jsx";

export default function CartPage() {
  const { cart, updateCart, removeFromCart } = useStore();
  const [status, setStatus] = useState("");
  useEffect(() => {
    document.title = "Your Bag — SRK Fragrance";
  }, []);
  const items = cart
    .map((entry) => ({ ...entry, product: findProduct(entry.id) }))
    .filter((entry) => entry.product);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = subtotal >= 999 ? 0 : 99;
  return (
    <main id="main">
      <PageHero eyebrow="Your selection" title="Your bag" />
      <section className="section container">
        {!items.length ? (
          <EmptyState
            title="Your bag is empty."
            message="Explore the collection and discover a scent made for you."
            action="Continue shopping"
            to="/arrival"
          />
        ) : (
          <div className="cart-layout">
            <div>
              {items.map(({ product, quantity }) => (
                <article className="cart-item" key={product.id}>
                  <Link
                    className="cart-item-image"
                    to={`/product?id=${product.id}`}
                  >
                    <img src={product.image} alt={product.name} />
                  </Link>
                  <div>
                    <h2>
                      <Link to={`/product?id=${product.id}`}>
                        {product.name}
                      </Link>
                    </h2>
                    <p>
                      {product.category} · {product.size}
                    </p>
                    <div className="quantity">
                      <button
                        onClick={() => updateCart(product.id, quantity - 1)}
                        aria-label={`Decrease ${product.name} quantity`}
                      >
                        −
                      </button>
                      <input value={quantity} readOnly aria-label="Quantity" />
                      <button
                        onClick={() => updateCart(product.id, quantity + 1)}
                        aria-label={`Increase ${product.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-button"
                      onClick={() => removeFromCart(product.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <strong>{formatPrice(product.price * quantity)}</strong>
                </article>
              ))}
            </div>
            <aside className="order-summary">
              <p className="eyebrow">Order summary</p>
              <h2>Your total</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {shipping ? formatPrice(shipping) : "Complimentary"}
                </span>
              </div>
              <div className="summary-row">
                <span>Discount</span>
                <span>—</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>{formatPrice(subtotal + shipping)}</span>
              </div>
              <button
                className="button button-dark"
                onClick={() =>
                  setStatus(
                    "Checkout is in demonstration mode. No payment has been processed.",
                  )
                }
              >
                Proceed to checkout
              </button>
              <p className="checkout-note">
                Demonstration store — no payment will be processed.
              </p>
              <div className="form-status" aria-live="polite">
                {status}
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
