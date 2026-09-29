import { useCallback } from 'react'
import { links, profile } from '../data/profile'

/** vCard 3.0 — phones prompt "add contact", so escape newlines and commas. */
const esc = (s: string) => String(s).replace(/\n/g, '\\n').replace(/,/g, '\\,')

export function useVCard() {
  return useCallback(() => {
    const contactFields = links
      .filter((l) => ['email', 'phone', 'website', 'portfolio', 'linkedin'].includes(l.id))
      .map((l) => {
        if (l.id === 'email') return `EMAIL;TYPE=INTERNET:${l.url.replace('mailto:', '')}`
        if (l.id === 'phone') return `TEL;TYPE=CELL:${l.url.replace('tel:', '')}`
        return `URL:${l.url}`
      })

    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${esc(profile.name)}`,
      `ORG:${esc(profile.role)}`,
      `NOTE:${esc(profile.bio)}`,
      ...contactFields,
      'END:VCARD',
    ].join('\r\n')

    const url = URL.createObjectURL(new Blob([vcard], { type: 'text/vcard;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.name.replace(/\s+/g, '-')}.vcf`
    a.click()
    URL.revokeObjectURL(url)
  }, [])
}
