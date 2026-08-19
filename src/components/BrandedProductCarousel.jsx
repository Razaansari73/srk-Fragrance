import { useEffect, useState } from 'react';

export default function BrandedProductCarousel({
  images,
  autoplay = true,
  interval = 3000,
  showDots = true,
  label = 'Branded fragrance collection',
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!autoplay || images.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % images.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [autoplay, images.length, interval]);

  return <div className="branded-carousel" role="region" aria-roledescription="carousel" aria-label={label}>
    <div className="branded-carousel-track">
      {images.map((image, index) => <div className={`branded-carousel-slide${index === active ? ' is-active' : ''}`} aria-hidden={index !== active} key={image.src}>
        <img src={image.src} alt={index === active ? image.alt : ''} loading="lazy"/>
      </div>)}
    </div>
    {showDots && images.length > 1 && <div className="branded-carousel-dots" aria-label="Choose product image">
      {images.map((image, index) => <button key={image.src} type="button" className={index === active ? 'is-active' : ''} aria-label={`Show product image ${index + 1}`} aria-current={index === active ? 'true' : undefined} onClick={() => setActive(index)}/>) }
    </div>}
  </div>;
}
