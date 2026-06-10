import { useState, useEffect } from 'react'
import { fmt } from '../config'
import { supabase } from '../supabase'

/* Panel "Mi cuenta": datos de envío + historial de pedidos + cerrar sesión */
export default function AccountDrawer({ isOpen, onClose, user, perfil, onPerfilSaved }) {
  const [nombre,    setNombre]    = useState('')
  const [telefono,  setTelefono]  = useState('')
  const [direccion, setDireccion] = useState('')
  const [ciudad,    setCiudad]    = useState('San Miguel de Tucumán')
  const [guardado,  setGuardado]  = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [pedidos,   setPedidos]   = useState(null)

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape' && isOpen) onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  /* Cargar datos del perfil al abrir (precarga del formulario) */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!isOpen) return
    setNombre(perfil?.nombre || user?.user_metadata?.full_name || '')
    setTelefono(perfil?.telefono || '')
    setDireccion(perfil?.direccion || '')
    setCiudad(perfil?.ciudad || 'San Miguel de Tucumán')
  }, [isOpen, perfil, user])
  /* eslint-enable react-hooks/set-state-in-effect */

  /* Cargar historial de pedidos al abrir */
  useEffect(() => {
    if (!isOpen || !supabase || !user) return
    supabase
      .from('pedidos')
      .select('id, items, total, creado')
      .order('creado', { ascending: false })
      .limit(10)
      .then(({ data, error }) => setPedidos(error ? [] : (data ?? [])))
  }, [isOpen, user])

  if (!supabase || !user) return null

  const guardarPerfil = async (e) => {
    e.preventDefault()
    setGuardando(true)
    const { error } = await supabase.from('perfiles').upsert({
      id: user.id,
      nombre:    nombre || null,
      telefono:  telefono || null,
      direccion: direccion || null,
      ciudad:    ciudad || null,
      actualizado: new Date().toISOString(),
    })
    setGuardando(false)
    if (!error) {
      setGuardado(true)
      onPerfilSaved?.({ id: user.id, nombre, telefono, direccion, ciudad })
      setTimeout(() => setGuardado(false), 2200)
    }
  }

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    onClose()
  }

  const fecha = (iso) => new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <>
      <div className={`overlay${isOpen ? ' open' : ''}`} onClick={onClose} aria-hidden="true"/>

      <aside className={`drawer${isOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Mi cuenta">
        <div className="drawer-head">
          <div>
            <h3>Mi cuenta</h3>
            <div className="count">{user.email}</div>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className="drawer-body">
          {/* Datos de envío */}
          <div className="acc-section">
            <h5 className="acc-title">Mis datos de envío</h5>
            <p className="acc-hint">Los usamos para precargar tus pedidos, así no escribís todo cada vez.</p>
            <form className="acc-form" onSubmit={guardarPerfil}>
              <input type="text" placeholder="Nombre y apellido" value={nombre} onChange={(e) => setNombre(e.target.value)}/>
              <input type="tel" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)}/>
              <input type="text" placeholder="Dirección (calle y número)" value={direccion} onChange={(e) => setDireccion(e.target.value)}/>
              <input type="text" placeholder="Ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)}/>
              <button type="submit" className="btn btn-primary acc-save" disabled={guardando}>
                {guardado ? '✓ Guardado' : guardando ? 'Guardando…' : 'Guardar mis datos'}
              </button>
            </form>
          </div>

          {/* Historial */}
          <div className="acc-section">
            <h5 className="acc-title">Mis pedidos</h5>
            {pedidos === null ? (
              <p className="acc-hint">Cargando…</p>
            ) : pedidos.length === 0 ? (
              <p className="acc-hint">Todavía no registramos pedidos en tu cuenta. Tu próximo pedido por WhatsApp va a quedar guardado acá.</p>
            ) : (
              <ul className="acc-pedidos">
                {pedidos.map((p) => (
                  <li key={p.id}>
                    <div className="acc-pedido-head">
                      <span className="f">{fecha(p.creado)}</span>
                      <b>{fmt(p.total)}</b>
                    </div>
                    <div className="acc-pedido-items">
                      {(p.items || []).map((it, i) => (
                        <span key={i}>{it.qty}× {it.name} ({it.molienda})</span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="drawer-foot">
          <button className="clear-cart acc-logout" onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </aside>
    </>
  )
}
