import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EmptyState, PageHero, ProductGrid } from "../components/Common.jsx";
import { products } from "../data/products.jsx";

const categoryOptions = [
  "all",
  ...new Set(products.map((item) => item.category)),
];
const sorters = {
  newest: (a, b) => Number(b.isNew) - Number(a.isNew),
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
  az: (a, b) => a.name.localeCompare(b.name),
  featured: (a, b) => Number(b.isFeatured) - Number(a.isFeatured),
};

export default function CatalogPage() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "all");
  const [sort, setSort] = useState(params.get("sort") || "featured");
  const [priceInput, setPriceInput] = useState("");
  const [max, setMax] = useState(Infinity);
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => {
    document.title = "Collections — SRK Fragrance";
  }, []);
  const newAttarArrivals = products
    .filter((product) => product.category.includes("Attar"))
    .slice(0, 4);
  const result = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products
      .filter(
        (product) =>
          (category === "all" || product.category === category) &&
          product.price <= max &&
          (!needle ||
            `${product.name} ${product.category} ${product.description}`
              .toLowerCase()
              .includes(needle)),
      )
      .sort(sorters[sort]);
  }, [query, category, sort, max]);
  const clear = () => {
    setQuery("");
    setCategory("all");
    setMax(Infinity);
    setPriceInput("");
  };
  return (
    <main id="main">
      <PageHero eyebrow="The fragrance edit" title="Collections">
        <p>
          Discover concentrated attars, expressive perfumes, and considered
          fragrance rituals.
        </p>
      </PageHero>
      {category === "all" && !query.trim() && (
        <section className="section container catalog-arrivals">
          <div className="section-header">
            <div>
              <p className="eyebrow">Just arrived</p>
              <h2>New Arrivals</h2>
            </div>
            <p>Four distinctive attars, selected to begin your discovery.</p>
          </div>
          <ProductGrid products={newAttarArrivals} />
        </section>
      )}
      <section className="section container catalog-collection">
        <div className="section-header catalog-section-heading">
          <div>
            <p className="eyebrow">Explore every ritual</p>
            <h2>Collections</h2>
          </div>
        </div>
        <div className="catalog-tools">
          <label className="catalog-search">
            <span className="sr-only">Search products</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search fragrances"
            />
          </label>
          <button
            className="button button-outline filter-toggle"
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            Filters
          </button>
          <label>
            <span className="sr-only">Sort products</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="az">Name: A–Z</option>
            </select>
          </label>
        </div>
        <div className="catalog-layout">
          <aside
            className={`filters${filtersOpen ? " is-open" : ""}`}
            aria-label="Product filters"
          >
            <h2>Categories</h2>
            <div className="filter-list">
              {categoryOptions.map((option) => (
                <button
                  key={option}
                  className={category === option ? "is-active" : ""}
                  onClick={() => {
                    setCategory(option);
                    setFiltersOpen(false);
                  }}
                >
                  {option === "all" ? "All fragrances" : option}
                </button>
              ))}
            </div>
            <h2 className="filter-title-spaced">Maximum price</h2>
            <input
              className="filter-select"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              type="number"
              min="0"
              step="100"
              placeholder="e.g. 1000"
              aria-label="Maximum price"
            />
            <button
              className="button button-dark filter-apply"
              onClick={() => setMax(Number(priceInput) || Infinity)}
            >
              Apply
            </button>
          </aside>
          <div>
            <div className="catalog-head">
              <span>
                {result.length} fragrance{result.length === 1 ? "" : "s"}
              </span>
              <span>Prices include taxes</span>
            </div>
            {result.length ? (
              <ProductGrid products={result} />
            ) : (
              <EmptyState
                title="No fragrances found"
                message="Try a broader search or clear your filters."
              />
            )}
            {!result.length && (
              <div className="empty-action">
                <button className="button button-dark" onClick={clear}>
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
