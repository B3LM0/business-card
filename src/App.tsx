import { useEffect, useState } from 'react'
import { CardPage } from './pages/CardPage'
import { QrPage } from './pages/QrPage'

/**
 * Hash routing. Chosen over the History API on purpose: it works on any static
 * host (Netlify, Vercel, GitHub Pages, plain nginx) with no rewrite rules.
 */
function useRoute() {
  const read = () => (window.location.hash.replace(/^#\/?/, '') || 'card')
  const [route, setRoute] = useState(read)

  useEffect(() => {
    const onChange = () => setRoute(read())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}

export default function App() {
  const route = useRoute()

  useEffect(() => {
    const titles: Record<string, string> = { card: 'Contact', qr: 'QR Code' }
    document.title = `${titles[route] ?? 'Contact'}`
  }, [route])

  return route === 'qr' ? <QrPage /> : <CardPage />
}
