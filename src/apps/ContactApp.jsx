import useContent from '../data/useContent';
import { useLocale } from '../i18n/useLocale';

export default function ContactApp() {
  const { profile } = useContent();
  const { t } = useLocale();

  return (
    <div className="app-pad center">
      <h2 className="app-title">{t('contact.title')}</h2>
      <p className="muted">{t('contact.subtitle')}</p>
      <a className="btn-primary" href={`mailto:${profile.email}`}>{profile.email}</a>
      <div className="contact-links">
        <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
        <a href={profile.website} target="_blank" rel="noopener noreferrer">hedisouaied.com</a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
    </div>
  );
}
