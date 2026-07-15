import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar        from './components/Navbar'
import CartDrawer    from './components/CartDrawer'
import AuthModal     from './components/AuthModal'
import AccountDrawer from './components/AccountDrawer'
import WhatsAppFloat from './components/WhatsAppFloat'
import Inicio        from './pages/Inicio'
import Tienda        from './pages/Tienda'
import SobreNosotros from './pages/SobreNosotros'
import Experiencia   from './pages/Experiencia'
import Mayorista     from './pages/Mayorista'
import { supabase }  from './supabase'
import { COFFEES }   from './config'

/* Al cambiar de ruta, la página nueva arranca siempre desde arriba */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

export default function App() {
  const [carrito,       setCarrito]       = useState([])
  const [drawerAbierto, setDrawerAbierto] = useState(false)

  /* Toast "agregado al carrito": aviso sutil en vez de abrir el carrito de golpe */
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  /* ── Cuenta de cliente (Supabase) ── */
  const [user,         setUser]         = useState(null)
  const [perfil,       setPerfil]       = useState(null)
  const [authAbierto,  setAuthAbierto]  = useState(false)
  const [cuentaAbierta, setCuentaAbierta] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, session) => {
      setUser(session?.user ?? null)
      if (session?.user) setAuthAbierto(false)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza el perfil con la sesión (sistema externo)
    if (!supabase || !user) { setPerfil(null); return }
    supabase.from('perfiles').select('*').eq('id', user.id).maybeSingle()
      .then(({ data }) => setPerfil(data ?? null))
  }, [user])

  // item: { id, key, name, region, accent, molienda, qty, price }
  const agregarAlCarrito = (item) => {
    setCarrito((prev) => {
      const existe = prev.find((x) => x.id === item.id)
      if (existe) {
        return prev.map((x) =>
          x.id === item.id ? { ...x, qty: Math.min(99, x.qty + item.qty) } : x
        )
      }
      return [...prev, item]
    })
    // Aviso sutil, sin interrumpir la navegación
    clearTimeout(toastTimer.current)
    setToast({
      name:    item.name,
      detalle: item.variante ?? `${item.molienda} · 250 g`,
      qty:     item.qty,
      foto:    COFFEES[item.key]?.foto || item.foto || null,
    })
    toastTimer.current = setTimeout(() => setToast(null), 3600)
  }

  const changeQty  = (id, delta) =>
    setCarrito((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: x.qty + delta } : x))
          .filter((x) => x.qty > 0)
    )

  const removeLine = (id)  => setCarrito((prev) => prev.filter((x) => x.id !== id))
  const clearCart  = ()    => setCarrito([])

  const totalItems = carrito.reduce((s, x) => s + x.qty, 0)
  const cartTotal  = carrito.reduce((s, x) => s + x.price * x.qty, 0)

  return (
    <BrowserRouter>
      <div className="grain" aria-hidden="true" />

      <ScrollToTop />

      <Navbar
        totalItems={totalItems}
        onCartClick={() => setDrawerAbierto(true)}
        user={user}
        onUserClick={() => (user ? setCuentaAbierta(true) : setAuthAbierto(true))}
      />

      <main>
        <Routes>
          <Route path="/"               element={<Inicio />} />
          <Route path="/tienda"         element={<Tienda agregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/experiencia"    element={<Experiencia />} />
          <Route path="/mayorista"      element={<Mayorista />} />
        </Routes>
      </main>

      <CartDrawer
        isOpen={drawerAbierto}
        onClose={() => setDrawerAbierto(false)}
        carrito={carrito}
        changeQty={changeQty}
        removeLine={removeLine}
        clearCart={clearCart}
        cartTotal={cartTotal}
        user={user}
        perfil={perfil}
      />

      <AuthModal
        isOpen={authAbierto}
        onClose={() => setAuthAbierto(false)}
      />

      <AccountDrawer
        isOpen={cuentaAbierta}
        onClose={() => setCuentaAbierta(false)}
        user={user}
        perfil={perfil}
        onPerfilSaved={setPerfil}
      />

      {/* Toast: producto agregado al carrito */}
      <div className={`cart-toast${toast ? ' show' : ''}`} role="status" aria-live="polite">
        {toast && (
          <>
            {toast.foto ? (
              <img className="ct-photo" src={toast.foto} alt="" />
            ) : (
              <span className="ct-check" aria-hidden="true">✓</span>
            )}
            <div className="ct-info">
              <b>{toast.qty > 1 ? `${toast.qty}× ` : ''}{toast.name}</b>
              <span>{toast.detalle} · agregado al carrito</span>
            </div>
            <button
              className="ct-btn"
              onClick={() => { clearTimeout(toastTimer.current); setToast(null); setDrawerAbierto(true) }}
            >
              Ver carrito
            </button>
          </>
        )}
      </div>

      <WhatsAppFloat />
    </BrowserRouter>
  )
}
