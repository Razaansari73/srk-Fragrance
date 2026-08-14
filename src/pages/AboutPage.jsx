import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Benefits, PageHero } from '../components/Common.jsx';

const benefits = [
  { title: 'Selected with intent', copy: 'A focused assortment, not an endless shelf.' },
  { title: 'Made to be lived in', copy: 'Scents for daily rituals as well as celebrations.' },
  { title: 'Rooted in craft', copy: 'Respect for traditional attar and oud culture.' },
  { title: 'Presented beautifully', copy: 'Premium experiences from discovery to delivery.' },
];

export default function AboutPage() {
  useEffect(() => { document.title = 'Our Story — SRK Fragrance'; }, []);
  return <main id="main">
    <PageHero eyebrow="Our story" title="Tradition, worn your way." breadcrumb="About"><p>SRK Fragrance brings the intimacy of attar and the confidence of modern perfumery into one considered collection.</p></PageHero>
    <section className="section container story-grid"><div className="story-image"><img src="/images/shop 1.webp" alt="A curated collection of traditional attar bottles"/></div><div className="story-copy"><p className="eyebrow">From Mumbai</p><h2>A personal approach to scent</h2><p>Fragrance can hold a place, a person, or a moment. Our collection began with that simple belief and a love for the concentrated warmth of traditional Indian attars.</p><p>Today, SRK pairs those roots with versatile perfumes, bakhoor, and gift sets—making expressive fragrance easier to discover without losing its sense of ritual.</p><Link className="button button-outline" to="/arrival">Explore the collection</Link></div></section>
    <section className="section story-section"><div className="container about-quote"><p className="eyebrow">Our philosophy</p><p>“A fine fragrance does not announce you. It becomes part of how a moment is remembered.”</p></div></section>
    <section className="section container"><Benefits items={benefits}/></section>
  </main>;
}
