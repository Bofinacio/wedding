import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle')
  const iban = 'ES9321000863290200953949'
  const formattedIban = 'ES93 2100 0863 2902 0095 3949'

  const showCopied = () => {
    setCopyStatus('copied')
    window.setTimeout(() => setCopyStatus('idle'), 2200)
  }

  const copyIbanToClipboard = async () => {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(iban)
        showCopied()
        return
      }

    const textarea = document.createElement('textarea')
    textarea.value = iban
    textarea.setAttribute('readonly', 'true')
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    const successful = document.execCommand('copy')
    document.body.removeChild(textarea)

    if (successful) {
      showCopied()
    }
  }

  useEffect(() => {
    const targetTimeZone = 'Europe/Madrid'
    const targetParts = {
      year: 2026,
      month: 8,
      day: 29,
      hour: 0,
      minute: 0,
      second: 0,
    }

    const getTimeInTimeZone = (date: Date, timeZone: string) => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })

      const parts = formatter.formatToParts(date).reduce<Record<string, string>>(
        (acc, part) => {
          if (part.type !== 'literal') {
            acc[part.type] = part.value
          }
          return acc
        },
        {}
      )

      return Date.UTC(
        Number(parts.year),
        Number(parts.month) - 1,
        Number(parts.day),
        Number(parts.hour),
        Number(parts.minute),
        Number(parts.second)
      )
    }

    const getTargetTimestamp = () =>
      Date.UTC(
        targetParts.year,
        targetParts.month - 1,
        targetParts.day,
        targetParts.hour,
        targetParts.minute,
        targetParts.second
      )

    const updateCountdown = () => {
      const nowInTargetZone = getTimeInTimeZone(new Date(), targetTimeZone)
      const targetTimestamp = getTargetTimestamp()
      const diffMs = Math.max(targetTimestamp - nowInTargetZone, 0)

      const totalSeconds = Math.floor(diffMs / 1000)
      const days = Math.floor(totalSeconds / 86400)
      const hours = Math.floor((totalSeconds % 86400) / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      setTimeLeft({ days, hours, minutes, seconds })
    }

    updateCountdown()
    const interval = window.setInterval(updateCountdown, 1000)

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Nos complace invitarles a nuestra boda</p>
        <h1 className="names">Idoia &amp; Joan</h1>
        <div className="heart" aria-hidden="true">
          ❤
        </div>
      </header>

      <section className="countdown">
        <p className="countdown-title">Falta poco para el gran día</p>
        <div className="countdown-grid">
          <div className="countdown-item">
            <span className="countdown-number">{timeLeft.days}</span>
            <span className="countdown-label">Días</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-number">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="countdown-label">Horas</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-number">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="countdown-label">Minutos</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-number">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="countdown-label">Segundos</span>
          </div>
        </div>
      </section>

      <section className="cards">
        <article className="event-card">
          <div className="event-header">
            <span className="event-icon" aria-hidden="true">
              ⛪
            </span>
            <h2>Ceremonia</h2>
          </div>
          <div className="event-body">
            <div className="event-row">
              <span className="event-label">Hora</span>
              <span className="event-value">12:00</span>
            </div>
            <div className="event-row">
              <span className="event-label">Lugar</span>
              <span className="event-value">
                Santuario de Nuestra Señora de Guadalupe
              </span>
            </div>
            <a
              className="event-button"
              href="https://maps.app.goo.gl/SBN3EnChwF669vp1A"
              target="_blank"
              rel="noreferrer"
            >
              Ver ubicación
            </a>
          </div>
        </article>

        <article className="event-card">
          <div className="event-header">
            <span className="event-icon" aria-hidden="true">
              🎉
            </span>
            <h2>Fiesta</h2>
          </div>
          <div className="event-body">
            <div className="event-row">
              <span className="event-label">Hora</span>
              <span className="event-value">Después de la ceremonia</span>
            </div>
            <div className="event-row">
              <span className="event-label">Lugar</span>
              <span className="event-value">Restaurante Beko Errota</span>
            </div>
            <a
              className="event-button"
              href="https://maps.app.goo.gl/jj1iWfn3XPrw1PST7"
              target="_blank"
              rel="noreferrer"
            >
              Ver ubicación
            </a>
          </div>
        </article>
      </section>

      <section className="gift">
        <div className="gift-icon" aria-hidden="true">
          🎁
        </div>
        <h2>Regalo</h2>
        <p>
          Que estés a nuestro lado en este día tan especial es el mejor
          regalo. Si deseas tener un detalle con nosotros, lo recibiremos con
          mucho cariño y nos acompañará en el inicio de nuestra nueva aventura.
        </p>
        <div className="gift-details">
          <span className="gift-label">Transferencia bancaria</span>
          <div className="gift-iban-row">
            <span className="gift-iban" aria-label={`IBAN ${formattedIban}`}>
              {formattedIban}
            </span>
            <button
              className="copy-button"
              type="button"
              onClick={copyIbanToClipboard}
              aria-label="Copiar IBAN"
            >
              <span className="copy-status" aria-live="polite">
                {copyStatus === 'copied' ? (
                  <span className="copy-check" aria-hidden="true">
                    ✓
                  </span>
                ) : (
                  <span className="copy-icon" aria-hidden="true">
                    ⧉
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="confirmation">
        <div className="confirmation-icon" aria-hidden="true">
          ✉️
        </div>
        <h2>Confirmación</h2>
        <p>Por favor, confirmad vuestra asistencia</p>
        <a
          className="primary-button"
          href="https://docs.google.com/forms/d/e/1FAIpQLScCUMCJ9mp8-OpbNLBM8Y0F8gTSW-EZiTPRHblmW0FkrDsVzg/viewform?usp=send_form"
          target="_blank"
          rel="noreferrer"
        >
          Confirmar asistencia
        </a>
      </section>

      <footer className="footer">
        <p>Esperamos compartir este día especial con vosotros</p>
        <span>29 de agosto de 2026</span>
      </footer>
    </div>
  )
}

export default App
