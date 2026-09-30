import { useState, useEffect } from 'react'
import { CFG, fmt, COFFEES, buscarCupon } from '../config'
import { supabase } from '../supabase'

export default function CartDrawer({ isOpen, onClose, carrito, changeQty, removeLine, clearCart, cartTotal, user, perfil }) {
  const [nombre, setNombre] = useState('')
  const [nota,   setNota]   = useState('')
  const [codigo, setCodigo] = useState('')
  const [cupon,  setCupon]  = useState(null)   // { codigo, pct } ya validado
  const [cuponError, setCuponError] = useState('')

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
  const descuento  = cupon ? Math.round(cartTotal * cupon.pct / 100) : 0
  const total      = cartTotal - descuento

  const aplicarCupon = () => {
    const { cupon: c, error } = buscarCupon(codigo)
    if (error) { setCupon(null); setCuponError(error); return }
    setCupon({ codigo: codigo.trim().toUpperCase(), pct: c.pct })
    setCuponError('')
  }

  const quitarCupon = () => { setCupon(null); setCodigo(''); setCuponError('') }

  const checkout = () => {
    if (!carrito.length) return
    /* Si el carrito quedó abierto y el código venció en el medio, no lo mandamos */
    if (cupon && buscarCupon(cupon.codigo).error) { quitarCupon(); setCuponError('Ese código ya venció.'); return }
    let msg = '¡Hola Mallku! ☕ Quiero hacer este pedido:\n\n'
    carrito.forEach((it) => {
      const detalle = it.variante ? it.variante : `${it.region} (${it.molienda}, 250 g)`
      msg += `• ${it.qty}× ${it.name} – ${detalle} — ${fmt(it.price * it.qty)}\n`
    })
    msg += `\nSubtotal: ${fmt(cartTotal)}`
    if (cupon) {
      msg += `\nDescuento ${cupon.pct}% (código ${cupon.codigo}): -${fmt(descuento)}`
      msg += `\nTotal: ${fmt(total)}`
    }
    if (nombre) msg += `\n\nNombre: ${nombre}`
    if (perfil?.direccion) msg += `\nDirección: ${perfil.direccion}${perfil.ciudad ? `, ${perfil.ciudad}` : ''}`
    if (nota)   msg += `\nNota: ${nota}`
    msg += '\n\n(Pedido generado desde la web)'

    /* Si está logueado, guardamos el pedido en su historial (sin bloquear el checkout) */
    if (supabase && user) {
      supabase.from('pedidos').insert({
        user_id: user.id,
        items:   carrito.map(({ key, name, region, molienda, variante, qty, price }) => ({ key, name, region, molienda, variante, qty, price })),
        total:   total,
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
              {(COFFEES[it.key]?.foto || it.foto) ? (
                <div className="line-thumb has-photo">
                  <img src={COFFEES[it.key]?.foto || it.foto} alt="" loading="lazy" />
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
                <div className="sub">{it.variante ? it.variante : `${it.region} · ${it.molienda} · 250 g`}</div>
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
          {cupon ? (
            <div className="cupon-ok">
              <span>Código <b>{cupon.codigo}</b> · {cupon.pct}% off</span>
              <button onClick={quitarCupon}>Quitar</button>
            </div>
          ) : (
            <div className="cupon">
              <input
                type="text"
                placeholder="Código de descuento"
                value={codigo}
                onChange={(e) => { setCodigo(e.target.value); setCuponError('') }}
                onKeyDown={(e) => { if (e.key === 'Enter') aplicarCupon() }}
              />
              <button onClick={aplicarCupon} disabled={!codigo.trim()}>Aplicar</button>
            </div>
          )}
          {cuponError && <p className="cupon-error">{cuponError}</p>}
          {cupon && (
            <div className="descuento">
              <span>Subtotal {fmt(cartTotal)}</span>
              <span>−{fmt(descuento)}</span>
            </div>
          )}
          <div className="subtotal">
            <span className="lbl">{cupon ? 'Total' : 'Subtotal'}</span>
            <span className="amt">{fmt(total)}</span>
          </div>
          <button className="wa-btn" onClick={checkout} disabled={!carrito.length}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Finalizar pedido por WhatsApp
          </button>
          <button className="clear-cart" onClick={clearCart}>Vaciar carrito</button>
        </div>
      </aside>
    </>
  )
}
