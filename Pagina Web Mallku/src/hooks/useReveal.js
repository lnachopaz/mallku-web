import { useEffect, useRef } from 'react'

/* Observa los elementos [data-reveal] dentro del contenedor y les agrega
   la clase "in" cuando entran en pantalla (animación de aparición).
   Usa un MutationObserver para captar también los elementos que se montan
   después (ej.: al cambiar de filtro en la tienda). */
export default function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if(!el) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target) } }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    const observar = () => el.querySelectorAll('[data-reveal]:not(.in)').forEach((n) => io.observe(n))
    observar()
    const mo = new MutationObserver(observar)
    mo.observe(el, { childList: true, subtree: true })
    return () => { io.disconnect(); mo.disconnect() }
  }, [])
  return ref
}
