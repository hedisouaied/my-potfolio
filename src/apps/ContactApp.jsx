import { profile } from '../data/profile';

export default function ContactApp() {
  return (
    <div className="app-pad center">
      <h3>Let's talk</h3>
      <p className="muted">Open to full-stack Laravel &amp; Filament work.</p>
      <a className="btn-primary" href={`mailto:${profile.email}`}>{profile.email}</a>
      <div className="contact-links">
        <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
        <a href={profile.website} target="_blank" rel="noopener noreferrer">hedisouaied.com</a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
    </div>
  );
}
