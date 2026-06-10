import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

/* Modal de ingreso/registro: Google o enlace mágico por email (sin contraseñas) */
export default function AuthModal({ isOpen, onClose }) {
  const [email,   setEmail]   = useState('')
  const [estado,  setEstado]  = useState('idle') // idle | enviando | enviado | error
  const [errMsg,  setErrMsg]  = useState('')

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape' && isOpen) onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [isOpen, onClose])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetea el modal al cerrarse
    if (!isOpen) { setEstado('idle'); setErrMsg('') }
  }, [isOpen])

  if (!supabase) return null

  const loginGoogle = async () => {
    setErrMsg('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) { setEstado('error'); setErrMsg(error.message) }
  }

  const loginEmail = async (e) => {
    e.preventDefault()
    if (!email) return
    setEstado('enviando'); setErrMsg('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    if (error) { setEstado('error'); setErrMsg(error.message) }
    else setEstado('enviado')
  }

  return (
    <>
      <div className={`overlay${isOpen ? ' open' : ''}`} onClick={onClose} aria-hidden="true"/>

      <div className={`auth-modal${isOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Ingresar a tu cuenta">
        <button className="drawer-close auth-close" onClick={onClose} aria-label="Cerrar">✕</button>

        <img className="auth-logo" src="/img/logo.png" alt="" width="64" height="64" />
        <h3>Tu cuenta Mallku</h3>
        <p className="auth-sub">
          Guardá tu dirección, mirá tu historial de pedidos y enterate antes que nadie de los nuevos lotes y eventos.
        </p>

        {estado === 'enviado' ? (
          <div className="auth-ok">
            <b>¡Revisá tu correo!</b>
            Te enviamos un enlace a <strong>{email}</strong>.<br/>
            Hacé clic en él y volvés acá con tu sesión iniciada.
          </div>
        ) : (
          <>
            <button className="auth-google" onClick={loginGoogle}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.93-2.91l-3.87-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.1A11.99 11.99 0 0 0 12 24z"/>
                <path fill="#FBBC05" d="M5.29 14.29A7.2 7.2 0 0 1 4.91 12c0-.8.14-1.57.38-2.29v-3.1H1.29A11.99 11.99 0 0 0 0 12c0 1.94.46 3.77 1.29 5.39l4-3.1z"/>
                <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.23 0 12 0 7.31 0 3.26 2.69 1.29 6.61l4 3.1C6.23 6.88 8.88 4.77 12 4.77z"/>
              </svg>
              Continuar con Google
            </button>

            <div className="auth-divider"><span>o con tu email</span></div>

            <form className="auth-form" onSubmit={loginEmail}>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Tu correo electrónico"
              />
              <button type="submit" className="btn btn-primary" disabled={estado === 'enviando'}>
                {estado === 'enviando' ? 'Enviando…' : 'Enviarme el enlace'}
              </button>
            </form>
            <p className="auth-note">Sin contraseñas: te llega un enlace de acceso a tu correo.</p>

            {estado === 'error' && <div className="auth-error">{errMsg || 'Algo salió mal. Probá de nuevo.'}</div>}
          </>
        )}
      </div>
    </>
  )
}
