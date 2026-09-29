/**
 * ►► EDIT ONLY THIS FILE ◄◄
 * Everything on the card is driven from here.
 */

import photo from '../assets/me.jpeg'

export const profile = {
  name: 'BENYAHIA Boualem',
  role: 'Full-Stack Junior Developer | Data Science & Machine Learning Student',
  bio: 'I build applications, work with data, and turn ideas into practical solutions',
  location: 'Beb Ezzouare, Alger',
  // Imported rather than a plain string: Vite fingerprints and bundles the file
  // so it survives being moved to dist/. A bare '../me.jpeg' would be resolved
  // by the browser against the page URL and 404.
  photoUrl: photo,
}

export type Link = {
  id: string
  label: string
  handle: string
  url: string
  icon: 'whatsapp' | 'github' | 'portfolio' | 'website' | 'email' | 'linkedin' | 'phone'
}

/** Order matters — this is the order the client sees on the card. */
export const links: Link[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    handle: '+213 673 128 102',
    // wa.me needs the number in international format: country code, no +, no spaces
    url: 'https://wa.me/213673128102',
    icon: 'whatsapp',
  },
  {
    id: 'github',
    label: 'GitHub',
    handle: '@b3lm0',
    url: 'https://github.com/b3lm0',
    icon: 'github',
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    handle: 'My Portfolio',
    url: 'https://b3lmportfolio.vercel.app/',
    icon: 'portfolio',
  },
  {
    id: 'email',
    label: 'Email',
    handle: 'benyahia.boualem@yahoo.com',
    url: 'mailto:benyahia.boualem@yahoo.com',
    icon: 'email',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'in/boualem-benyahia',
    url: 'https://www.linkedin.com/in/boualem-benyahia-6332a0321?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    icon: 'linkedin',
  },
  {
    id: 'phone',
    label: 'Call me',
    handle: '+213 673 128 102',
    url: 'tel:+213673128102',
    icon: 'phone',
  },
]
