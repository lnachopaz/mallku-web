import { useState, useEffect } from 'react'
import { CFG, fmt, COFFEES } from '../config'
import { supabase } from '../supabase'

export default function CartDrawer({ isOpen, onClose, carrito, changeQty, removeLine, clearCart, cartTotal, user, perfil }) {
  const [nombre, setNombre] = useState('')
  const [nota,   setNota]   = useState('')

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape' && isOpen) onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  /* Si el cliente está logueado, precargamos su nombre */
  useEffect(() => {
    if (!nombre && (perfil?.nombre || user?.user_metadata?.full_name)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- precarga el nombre del cliente logueado
      setNombre(perfil?.nombre || user.user_metadata.full_name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, perfil])

  const totalItems = carrito.reduce((s, x) => s + x.qty, 0)

  const checkout = () => {
    if (!carrito.length) return
    let msg = '¡Hola Mallku! ☕ Quiero hacer este pedido:\n\n'
    carrito.forEach((it) => {
      msg += `• ${it.qty}× ${it.name} – ${it.region} (${it.molienda}, 250 g) — ${fmt(it.price * it.qty)}\n`
    })
    msg += `\nSubtotal: ${fmt(cartTotal)}`
    if (nombre) msg += `\n\nNombre: ${nombre}`
    if (perfil?.direccion) msg += `\nDirección: ${perfil.direccion}${perfil.ciudad ? `, ${perfil.ciudad}` : ''}`
    if (nota)   msg += `\nNota: ${nota}`
    msg += '\n\n(Pedido generado desde la web)'

    /* Si está logueado, guardamos el pedido en su historial (sin bloquear el checkout) */
    if (supabase && user) {
      supabase.from('pedidos').insert({
        user_id: user.id,
        items:   carrito.map(({ key, name, region, molienda, qty, price }) => ({ key, name, region, molienda, qty, price })),
        total:   cartTotal,
        nombre:  nombre || null,
        nota:    nota || null,
      }).then(({ error }) => { if (error) console.warn('No se pudo guardar el pedido:', error.message) })
    }

    window.open(`https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <>
      <div className={`overlay${isOpen ? ' open' : ''}`} onClick={onClose} aria-hidden="true"/>

      <aside className={`drawer${isOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Carrito de compras">
        <div className="drawer-head">
          <div>
            <h3>Tu carrito</h3>
            <div className="count">{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</div>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className="drawer-body">
          {carrito.length === 0 ? (
            <div className="cart-empty">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 7h12l1.2 12.2a1 1 0 0 1-1 1.1H5.8a1 1 0 0 1-1-1.1L6 7z" strokeLinejoin="round"/>
                <path d="M9 7a3 3 0 0 1 6 0" strokeLinecap="round"/>
              </svg>
              <p>Tu carrito está vacío.<br/>Elegí un café para empezar.</p>
            </div>
          ) : carrito.map((it) => (
            <div className="line-item" key={it.id}>
              {/* miniatura: foto real del producto (con iniciales como respaldo) */}
              {COFFEES[it.key]?.foto ? (
                <div className="line-thumb has-photo">
                  <img src={COFFEES[it.key].foto} alt="" loading="lazy" />
                </div>
              ) : (
                <div
                  className="line-thumb"
                  data-i={(it.name || '?').slice(0, 3).toUpperCase()}
                  style={{ background: it.accent }}
                />
              )}
              <div className="line-info">
                <h4>{it.name}</h4>
                <div className="sub">{it.region} · {it.molienda} · 250 g</div>
                <div className="lq">
                  <div className="mini">
                    <button onClick={() => changeQty(it.id, -1)} aria-label="Restar">−</button>
                    <span>{it.qty}</span>
                    <button onClick={() => changeQty(it.id, +1)} aria-label="Sumar">+</button>
                  </div>
                </div>
              </div>
              <div className="line-right">
                <div className="lp">{fmt(it.price * it.qty)}</div>
                <button className="rm" onClick={() => removeLine(it.id)}>Quitar</button>
              </div>
            </div>
          ))}
        </div>

        <div className="drawer-foot">
          <p className="ship-note">El pedido se confirma por WhatsApp. Ahí coordinamos envío o retiro y el pago.</p>
          <input type="text" placeholder="Tu nombre (opcional)" value={nombre} onChange={(e) => setNombre(e.target.value)}/>
          <textarea rows={2} placeholder="Nota: dirección, método de café, etc. (opcional)" value={nota} onChange={(e) => setNota(e.target.value)}/>
          <div className="subtotal">
            <span className="lbl">Subtotal</span>
            <span className="amt">{fmt(cartTotal)}</span>
          </div>
          <button className="wa-btn" onClick={checkout} disabled={!carrito.length}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm-2.47 6.1c.17 0 .35 0 .5.01.16.01.38-.06.59.45.22.53.74 1.84.8 1.97.07.13.11.29.02.46-.09.18-.13.29-.27.45-.13.16-.28.36-.4.48-.14.13-.28.28-.12.55.16.27.7 1.15 1.5 1.86 1.03.91 1.9 1.19 2.17 1.33.27.13.43.11.59-.07.16-.18.68-.79.86-1.06.18-.27.36-.22.6-.13.25.09 1.56.74 1.83.87.27.13.45.2.52.31.07.11.07.65-.16 1.27-.22.62-1.31 1.22-1.8 1.27-.49.04-.95.22-3.2-.67-2.7-1.06-4.46-3.78-4.6-3.96-.14-.18-1.11-1.47-1.11-2.81 0-1.34.7-2 .95-2.27.25-.27.54-.34.72-.34z"/>
            </svg>
            Finalizar pedido por WhatsApp
          </button>
          <button className="clear-cart" onClick={clearCart}>Vaciar carrito</button>
        </div>
      </aside>
    </>
  )
}
