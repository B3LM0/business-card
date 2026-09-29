import QRCode from 'qrcode'
import { links, profile } from '../data/profile'

/** Instagram portrait post: 4:5 at 1080px wide. */
export const CARD_W = 1080
export const CARD_H = 1350

const SANS = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
const font = (weight: number, size: number) => `${weight} ${size}px ${SANS}`

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load the generated QR image.'))
    img.src = src
  })
}

/** roundRect is recent; fall back to arcTo so older browsers still work. */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, rr)
    return
  }
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

function text(ctx: CanvasRenderingContext2D, str: string, cx: number, baseline: number) {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(str, cx, baseline)
}

function blob(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, color)
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(x - r, y - r, r * 2, r * 2)
}

function pill(
  ctx: CanvasRenderingContext2D,
  label: string,
  cx: number,
  y: number,
  height: number,
) {
  ctx.font = font(600, 24)
  const w = ctx.measureText(label).width + 56
  ctx.fillStyle = '#f7f9fd'
  roundRect(ctx, cx - w / 2, y, w, height, height / 2)
  ctx.fill()
  ctx.strokeStyle = '#e2e8f4'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.fillStyle = '#6b7a93'
  text(ctx, label, cx, y + height / 2 + 8)
}

/**
 * Draws the shareable card to an offscreen canvas and returns a PNG data URL.
 * Mirrors the on-screen .qr-card: name, role, framed QR, and enough contact
 * detail that the image still works if someone screenshots it.
 */
export async function renderCardPng(siteUrl: string): Promise<string> {
  const qrSrc = await QRCode.toDataURL(siteUrl, {
    width: 1100,
    margin: 0,
    errorCorrectionLevel: 'H',
    color: { dark: '#0d1526', light: '#ffffff' },
  })
  const qr = await loadImage(qrSrc)

  const canvas = document.createElement('canvas')
  canvas.width = CARD_W
  canvas.height = CARD_H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D is not available in this browser.')

  // ---- background ----
  const bg = ctx.createLinearGradient(0, 0, CARD_W, CARD_H)
  bg.addColorStop(0, '#eef4ff')
  bg.addColorStop(0.5, '#e8eefb')
  bg.addColorStop(1, '#eef1fe')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, CARD_W, CARD_H)
  blob(ctx, 120, 60, 460, 'rgba(34,211,238,0.35)')
  blob(ctx, 1000, 200, 500, 'rgba(99,102,241,0.30)')
  blob(ctx, 540, 1320, 560, 'rgba(59,130,246,0.26)')

  // ---- card box ----
  const boxX = 80
  const boxY = 70
  const boxW = CARD_W - 160
  const boxH = CARD_H - 140
  const radius = 48

  ctx.save()
  ctx.shadowColor = 'rgba(29,61,133,0.22)'
  ctx.shadowBlur = 60
  ctx.shadowOffsetY = 24
  ctx.fillStyle = '#ffffff'
  roundRect(ctx, boxX, boxY, boxW, boxH, radius)
  ctx.fill()
  ctx.restore()

  ctx.strokeStyle = '#e2e8f4'
  ctx.lineWidth = 2
  roundRect(ctx, boxX, boxY, boxW, boxH, radius)
  ctx.stroke()

  const cx = CARD_W / 2

  // ---- header ----
  pill(ctx, 'SCAN TO CONNECT', cx, 130, 58)

  ctx.fillStyle = '#0d1526'
  ctx.font = font(700, 68)
  text(ctx, profile.name, cx, 315)

  ctx.fillStyle = '#2563eb'
  ctx.font = font(600, 36)
  text(ctx, profile.role, cx, 375)

  // ---- QR ----
  const qrBox = 500
  const qrX = cx - qrBox / 2
  const qrY = 430

  ctx.save()
  ctx.shadowColor = 'rgba(29,61,133,0.18)'
  ctx.shadowBlur = 40
  ctx.shadowOffsetY = 14
  ctx.fillStyle = '#ffffff'
  roundRect(ctx, qrX, qrY, qrBox, qrBox, 28)
  ctx.fill()
  ctx.restore()

  ctx.strokeStyle = '#e2e8f4'
  ctx.lineWidth = 2
  roundRect(ctx, qrX, qrY, qrBox, qrBox, 28)
  ctx.stroke()

  const pad = 22
  const qrSize = qrBox - pad * 2
  ctx.drawImage(qr, qrX + pad, qrY + pad, qrSize, qrSize)

  // ---- footer ----
  ctx.fillStyle = '#5a6a86'
  ctx.font = font(500, 30)
  text(ctx, 'Point your camera at the square', cx, 1000)

  const email = links.find((l) => l.id === 'email')?.handle
  const phone = links.find((l) => l.id === 'phone')?.handle
  ctx.fillStyle = '#3c4a63'
  ctx.font = font(600, 30)
  if (email) text(ctx, email, cx, 1060)
  if (phone) text(ctx, phone, cx, 1108)

  pill(ctx, siteUrl.replace(/^https?:\/\//, ''), cx, 1150, 62)

  return canvas.toDataURL('image/png')
}
