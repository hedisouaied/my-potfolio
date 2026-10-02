import useContent from '../data/useContent';
import { useLocale } from '../i18n/useLocale';
import profilePhoto from '../assets/profile-photo.jpg';

export default function AboutApp() {
  const { profile, additional } = useContent();
  const { t } = useLocale();

  return (
    <div className="app-pad">
      <div className="about-head">
        {/* Name and role sit right beside it, so the photo adds no information
            for a screen reader and is marked decorative. */}
        <img className="about-avatar" src={profilePhoto} alt="" />
        <div>
          <h2>{profile.name}</h2>
          <p className="muted">{profile.role} · {profile.location}</p>
        </div>
      </div>
      <p>{profile.summary}</p>

      <div className="chip-row">
        {additional.languages.map((l) => <span className="chip" key={l}>{l}</span>)}
      </div>

      <h4>{t('about.strengths')}</h4>
      <div className="chip-row">
        {additional.strengths.map((s) => <span className="chip" key={s}>{s}</span>)}
      </div>

      <h4>{t('about.interests')}</h4>
      <div className="chip-row">
        {additional.interests.map((s) => <span className="chip" key={s}>{s}</span>)}
      </div>
    </div>
  );
}
