import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { profile } from '../data/profile'

/**
 * Separate page — reached at <site>/#/qr — so the QR never appears on the card
 * a client sees. This is the one you screenshot, download or print for your own
 * business card.
 */
export function QrPage() {
  const [copied, setCopied] = useState(false)
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

  async function downloadPng() {
    try {
      const dataUrl = await QRCode.toDataURL(siteUrl, {
        width: 1024,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: { dark: '#08070E', light: '#FFFFFF' },
      })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'my-qr-code.png'
      a.click()
    } catch {
      setError('Could not generate the PNG — take a screenshot instead.')
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
          <button className="btn btn-primary" onClick={downloadPng} type="button">
            Download PNG
          </button>
          <button className="btn btn-ghost" onClick={copyLink} type="button">
            {copied ? 'Link copied' : 'Copy link'}
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
      color: { dark: '#08070E', light: '#FFFFFF' },
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
