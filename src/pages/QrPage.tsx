import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { profile } from '../data/profile'
import { renderCardPng } from '../lib/renderCard'

/**
 * Separate page — reached at <site>/#/qr — so the QR never appears on the card
 * a client sees. This is the one you download or screenshot for your own
 * business card.
 */
export function QrPage() {
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const siteUrl = window.location.origin

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(siteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Clipboard blocked by the browser — long-press the URL below instead.')
    }
  }

  async function downloadCard() {
    setBusy(true)
    setError(null)
    try {
      const dataUrl = await renderCardPng(siteUrl)
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'contact-card.png'
      a.click()
    } catch (err) {
      setError(
        err instanceof Error
          ? `Could not build the image: ${err.message}`
          : 'Could not build the image — take a screenshot instead.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="page page-qr">
      <a className="back" href="#/">
        &larr; Back to card
      </a>

      <section className="qr-card">
        <p className="qr-kicker">Scan to connect</p>
        <h1>{profile.name}</h1>
        <p className="qr-role">{profile.role}</p>

        <div className="qr-frame">
          <QrImage value={siteUrl} />
        </div>

        <p className="qr-hint">Point any camera app at the square above</p>

        <div className="qr-actions">
          <button className="btn btn-primary" onClick={downloadCard} disabled={busy} type="button">
            {busy ? 'Working…' : 'Download card'}
          </button>
          <button className="btn btn-ghost" onClick={copyLink} type="button">
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>

        {error && <p className="qr-error">{error}</p>}

        <code className="site-url">{siteUrl}</code>
      </section>
    </main>
  )
}

function QrImage({ value }: { value: string }) {
  const [src, setSrc] = useState('')

  useEffect(() => {
    let cancelled = false
    QRCode.toDataURL(value, {
      width: 640,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#0d1526', light: '#FFFFFF' },
    })
      .then((url) => {
        if (!cancelled) setSrc(url)
      })
      .catch(() => {
        if (!cancelled) setSrc('')
      })
    return () => {
      cancelled = true
    }
  }, [value])

  if (!src) return <div className="qr-skeleton" aria-hidden="true" />
  return <img className="qr-img" src={src} alt="QR code linking to this contact card" width={220} height={220} />
}
