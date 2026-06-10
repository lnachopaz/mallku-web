import { useState, useEffect } from 'react'
import Navbar        from './components/Navbar'
import CartDrawer    from './components/CartDrawer'
import AuthModal     from './components/AuthModal'
import AccountDrawer from './components/AccountDrawer'
import Inicio        from './pages/Inicio'
import Tienda        from './pages/Tienda'
import { supabase }  from './supabase'

export default function App() {
  const [paginaActual,  setPaginaActual]  = useState('inicio')
  const [carrito,       setCarrito]       = useState([])
  const [drawerAbierto, setDrawerAbierto] = useState(false)

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

  const navegar = (pagina) => {
    setPaginaActual(pagina)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
    setDrawerAbierto(true)
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
    <>
      <div className="grain" aria-hidden="true" />

      <Navbar
        paginaActual={paginaActual}
        navegar={navegar}
        totalItems={totalItems}
        onCartClick={() => setDrawerAbierto(true)}
        user={user}
        onUserClick={() => (user ? setCuentaAbierta(true) : setAuthAbierto(true))}
      />

      <main>
        {paginaActual === 'inicio' && <Inicio navegar={navegar} />}
        {paginaActual === 'tienda' && <Tienda agregarAlCarrito={agregarAlCarrito} />}
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
    </>
  )
}
