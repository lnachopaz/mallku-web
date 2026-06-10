import { useState } from 'react'
import Navbar     from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import Inicio     from './pages/Inicio'
import Tienda     from './pages/Tienda'

export default function App() {
  const [paginaActual,  setPaginaActual]  = useState('inicio')
  const [carrito,       setCarrito]       = useState([])
  const [drawerAbierto, setDrawerAbierto] = useState(false)

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
      />
    </>
  )
}
