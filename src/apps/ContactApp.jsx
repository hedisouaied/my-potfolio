import useContent from '../data/useContent';
import { useLocale } from '../i18n/useLocale';
import Magnetic from '../motion/Magnetic';
import { Reveal, RevealGroup } from '../motion/Reveal';

export default function ContactApp() {
  const { profile } = useContent();
  const { t } = useLocale();

  const links = [
    { href: profile.website, label: profile.website.replace(/^https?:\/\//, ''), external: true },
    { href: profile.linkedin, label: 'LinkedIn', external: true },
  ];

  return (
    <div className="app-pad center">
      <Reveal variant="split">
        <h2 className="app-title">{t('contact.title')}</h2>
      </Reveal>
      <Reveal variant="up" delay={90}>
        <p className="muted">{t('contact.subtitle')}</p>
      </Reveal>

      <Reveal variant="scale" delay={160}>
        <Magnetic strength={0.16}>
          <a className="btn-primary" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </Magnetic>
      </Reveal>

      <RevealGroup className="contact-links" stagger={70} base={240}>
        <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
        {links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
            {l.label}
          </a>
        ))}
      </RevealGroup>
    </div>
  );
}