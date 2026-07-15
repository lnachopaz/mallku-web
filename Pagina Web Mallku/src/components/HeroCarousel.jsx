import { useState, useEffect, useCallback } from 'react'

export default function HeroCarousel({ slides, interval = 5000, parallax }) {
  const [index,  setIndex]  = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || slides.length <= 1) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, interval)
    return () => clearInterval(id)
  }, [paused, slides.length, interval])

  const goTo = useCallback((i) => setIndex(i), [])

  return (
    <div
      className="hero-carousel"
      data-parallax={parallax}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-carousel-frame">
        {slides.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            className={`hero-carousel-img${i === index ? ' active' : ''}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : undefined}
          />
        ))}
      </div>

      {slides.length > 1 && (
        <div className="hero-carousel-dots">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              className={`hero-carousel-dot${i === index ? ' active' : ''}`}
              aria-label={`Ver foto ${i + 1} de ${slides.length}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
