import { useEffect } from 'react';
import { EmptyState, PageHero, ProductGrid } from '../components/Common.jsx';
import { products } from '../data/products.jsx';
import { useStore } from '../store/StoreContext.jsx';

export default function FavoritesPage() {
  const { favorites } = useStore(); useEffect(() => { document.title = 'Favorites — SRK Fragrance'; }, []);
  const saved = products.filter((product) => favorites.includes(product.id));
  return <main id="main"><PageHero eyebrow="Your edit" title="Favorites"><p>A personal collection of scents worth returning to.</p></PageHero><section className="section container">{saved.length ? <ProductGrid products={saved}/> : <EmptyState icon="♡" title="Your collection is waiting." message="Save fragrances you love and find them here anytime." action="Explore collection" to="/arrival"/>}</section></main>;
}
