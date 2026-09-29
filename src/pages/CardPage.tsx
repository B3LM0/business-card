import { links, profile } from '../data/profile'
import { LinkIcon } from '../components/LinkIcon'
import { useContactSave } from '../hooks/useVCard'

const isExternal = (url: string) => url.startsWith('http')

const initials = profile.name
  .split(' ')
  .map((w) => w[0])
  .join('')
  .slice(0, 2)
  .toUpperCase()

export function CardPage() {
  const saveContact = useContactSave()

  return (
    <main className="page">
      <article className="vcard">
        <header className="vcard-head">
          <div className="photo-ring">
            {profile.photoUrl ? (
              <img className="photo" src={profile.photoUrl} alt={profile.name} />
            ) : (
              <div className="photo photo-initials" aria-hidden="true">
                {initials}
              </div>
            )}
          </div>
          <h1>{profile.name}</h1>
          <p className="role">{profile.role}</p>
          <p className="bio">{profile.bio}</p>
          <p className="location">
            <span className="pin" aria-hidden="true" />
            {profile.location}
          </p>
        </header>

        <nav className="vcard-links" aria-label="Contact links">
          {links.map((l) => (
            <a
              key={l.id}
              className="link-row"
              href={l.url}
              target={isExternal(l.url) ? '_blank' : undefined}
              rel="noreferrer noopener"
            >
              <span className={`link-icon icon-${l.id}`}>
                <LinkIcon icon={l.icon} />
              </span>
              <span className="link-text">
                <strong>{l.label}</strong>
                <em>{l.handle}</em>
              </span>
              <span className="chevron" aria-hidden="true">
                &rsaquo;
              </span>
            </a>
          ))}
        </nav>

        <footer className="vcard-foot">
          <button className="btn btn-primary" onClick={saveContact} type="button">
            Save to phone
          </button>
          <a className="ghost-link" href="#/qr">
            Show my QR code
          </a>
        </footer>
      </article>
    </main>
  )
}
