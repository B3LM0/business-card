import { useCallback } from 'react'
import { links, profile } from '../data/profile'

/** vCard 3.0 — escape newlines and commas per the vCard 3.0 spec. */
const esc = (s: string) => String(s).replace(/\n/g, '\\n').replace(/,/g, '\\,')

export function buildVCard(): string {
  const parts = profile.name.trim().split(/\s+/)
  const given = parts.length > 1 ? parts.slice(0, -1).join(' ') : ''
  const family = parts.length > 1 ? parts[parts.length - 1] : parts[0]

  const fields = links
    .filter((l) => ['email', 'phone', 'website', 'portfolio', 'linkedin'].includes(l.id))
    .map((l) => {
      if (l.id === 'email') return `EMAIL;TYPE=INTERNET:${l.url.replace('mailto:', '')}`
      if (l.id === 'phone') return `TEL;TYPE=CELL:${l.url.replace('tel:', '')}`
      return `URL:${l.url}`
    })

  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${esc(profile.name)}`,
    // Some Android contact importers rely on the structured name; FN alone is not enough.
    `N:${esc(family)};${esc(given)};;;`,
    `ORG:${esc(profile.role)}`,
    `TITLE:${esc(profile.role)}`,
    `NOTE:${esc(profile.bio)}`,
    `ADR;TYPE=WORK:;;${esc(profile.location)};;;;`,
    ...fields,
    'END:VCARD',
  ].join('\r\n')
}

export function createVCardFile(): File {
  return new File([buildVCard()], `${profile.name.replace(/\s+/g, '-')}.vcf`, {
    type: 'text/vcard;charset=utf-8',
  })
}

function triggerDownload(file: File) {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * A web page cannot write to a phone's contacts database — that is a sandboxed
 * system store no browser is allowed to touch. The closest the platform allows
 * is the Web Share API: hand the .vcf to the native share sheet, where Android
 * offers "Save to Contacts" directly. Desktop has no share API, so we fall back
 * to downloading the file.
 */
export function useContactSave() {
  const save = useCallback(async (): Promise<'shared' | 'downloaded'> => {
    const file = createVCardFile()

    const shareable =
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function' &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [file] })

    if (shareable) {
      try {
        await navigator.share({
          files: [file],
          title: profile.name,
          text: `${profile.name} — ${profile.role}`,
        })
        return 'shared'
      } catch (err) {
        // The user dismissing the sheet is not an error worth surfacing.
        if (err instanceof DOMException && err.name === 'AbortError') return 'shared'
        // Any other failure: fall through to the download rather than dead-end.
      }
    }

    triggerDownload(file)
    return 'downloaded'
  }, [])

  return save
}
