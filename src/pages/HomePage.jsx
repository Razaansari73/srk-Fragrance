import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Benefits, ProductGrid } from "../components/Common.jsx";
import BrandedProductCarousel from "../components/BrandedProductCarousel.jsx";
import { NewsletterForm } from "../components/Layout.jsx";
import {
  categories,
  heroSlides,
  homeHeritageImages,
  products,
} from "../data/products.jsx";

function HeroCarousel() {
  const [active, setActive] = useState(0);
  const touch = useRef(0);
  const show = (index) =>
    setActive((index + heroSlides.length) % heroSlides.length);
  useEffect(() => {
    const timer = window.setInterval(
      () => setActive((value) => (value + 1) % heroSlides.length),
      2000,
    );
    return () => window.clearInterval(timer);
  }, []);
  return (
    <section
      className="hero-carousel"
      aria-roledescription="carousel"
      aria-label="Featured fragrances"
      tabIndex="0"
      onKeyDown={(e) =>
        e.key === "ArrowRight"
          ? show(active + 1)
          : e.key === "ArrowLeft" && show(active - 1)
      }
      onTouchStart={(e) => (touch.current = e.changedTouches[0].clientX)}
      onTouchEnd={(e) => {
        const distance = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(distance) > 45) show(active + (distance < 0 ? 1 : -1));
      }}
    >
      {heroSlides.map((slide, index) => (
        <article
          key={slide.title}
          className={`hero-slide hero-slide--${slide.tone}${index === active ? " is-active" : ""}`}
          aria-hidden={index !== active}
          style={slide.mobilePosition ? { "--hero-mobile-position": slide.mobilePosition } : undefined}
        >
          <div className="hero-image">
            <img src={slide.image} alt={slide.alt} />
          </div>
          <div className="hero-copy">
            <p className="eyebrow">{slide.eyebrow}</p>
            <h1>{slide.title}</h1>
            <p>{slide.copy}</p>
            <div className="hero-actions">
              {slide.actions.map(([to, label], i) => (
                <Link
                  key={to}
                  className={`button ${i ? "button-ghost" : "button-light"}`}
                  to={to}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </article>
      ))}
      <div className="carousel-controls">
        <div className="carousel-dots" aria-label="Choose slide">
          {heroSlides.map((slide, i) => (
            <button
              key={slide.title}
              className={i === active ? "is-active" : ""}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => show(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const benefits = [
  {
    title: "Authentic fragrances",
    copy: "Considered scents rooted in a rich perfumery tradition.",
  },
  {
    title: "Premium quality",
    copy: "Carefully selected compositions and elegant presentation.",
  },
  {
    title: "Long-lasting scent",
    copy: "Expressive fragrance designed to evolve beautifully.",
  },
  {
    title: "Crafted with care",
    copy: "A focused collection made for meaningful daily rituals.",
  },
];

export default function HomePage() {
  useEffect(() => {
    document.title = "SRK Fragrance — The Art of Fragrance";
  }, []);
  return (
    <main id="main">
      <HeroCarousel />
      <section className="section container">
        <div className="section-header">
          <div>
            <p className="eyebrow">Curated for you</p>
            <h2>Signature collection</h2>
            <p>
              Distinctive compositions selected for character, longevity, and
              effortless refinement.
            </p>
          </div>
          <Link className="text-link" to="/arrival">
            View all fragrances
          </Link>
        </div>
        <ProductGrid
          products={products.filter((item) => item.isFeatured).slice(0, 4)}
        />
      </section>
      <section className="section collection-section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="eyebrow">Find your ritual</p>
              <h2>Shop by collection</h2>
            </div>
            <p>
              Move from fresh daily signatures to rich traditional oud, with
              every collection only a touch away.
            </p>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <Link
                className="category-card"
                key={category.name}
                to={`/arrival?category=${encodeURIComponent(category.name)}`}
              >
                <div className="category-image">
                  <img
                    src={category.image}
                    alt={`Explore ${category.name}`}
                    loading="lazy"
                  />
                </div>
                <div className="category-copy">
                  <p className="category-label">{category.label}</p>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <span>
                    Explore collection <b aria-hidden="true">→</b>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section story-section">
        <div className="container story-grid">
          <div className="story-image story-image--heritage">
            <BrandedProductCarousel
              images={homeHeritageImages}
              interval={2500}
              label="Heritage fragrance products"
            />
          </div>
          <div className="story-copy">
            <p className="eyebrow">Our heritage</p>
            <h2>The essence of tradition</h2>
            <p>
              SRK Fragrance connects the intimacy of traditional attar craft
              with a clean, contemporary sensibility. Each fragrance is chosen
              to feel personal—unfolding with warmth, depth, and a character all
              its own.
            </p>
            <Link className="button button-outline" to="/about">
              Discover our story
            </Link>
          </div>
        </div>
      </section>
      {/* <section className="section container"><div className="section-header"><div><p className="eyebrow">Just arrived</p><h2>New expressions</h2></div><Link className="text-link" to="/arrival?sort=newest">Shop new arrivals</Link></div><ProductGrid products={products.filter((item) => item.isNew).slice(0, 4)}/></section> */}
      <section className="section-compact container">
        <Benefits items={benefits} />
      </section>
      <section className="section newsletter-banner">
        <div className="container">
          <p className="eyebrow">Private notes</p>
          <h2>Enter the fragrance journal</h2>
          <p>Be first to discover new compositions and considered offers.</p>
          <NewsletterForm className="newsletter-inline" />
        </div>
      </section>
    </main>
  );
}
