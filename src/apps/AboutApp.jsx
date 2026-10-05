import useContent from '../data/useContent';
import { useLocale } from '../i18n/useLocale';
import { Reveal, RevealGroup } from '../motion/Reveal';
import profilePhoto from '../assets/profile-photo.jpg';

export default function AboutApp() {
  const { profile, additional } = useContent();
  const { t } = useLocale();

  return (
    <div className="app-pad">
      <Reveal className="about-head" variant="split">
        {/* Name and role sit right beside it, so the photo adds no information
            for a screen reader and is marked decorative. */}
        <span className="about-avatar-wrap">
          <span className="about-avatar-ring" aria-hidden="true" />
          <img className="about-avatar" src={profilePhoto} alt="" />
        </span>
        <div className="about-head-text">
          <h2>{profile.name}</h2>
          <p className="muted">{profile.role} · {profile.location}</p>
        </div>
      </Reveal>

      <Reveal variant="up" delay={90}>
        <p>{profile.summary}</p>
      </Reveal>

      <RevealGroup className="chip-row" stagger={38} base={160}>
        {additional.languages.map((l) => (
          <span className="chip" key={l}>
            {l}
          </span>
        ))}
      </RevealGroup>

      <Reveal variant="fade" delay={40}>
        <h4>{t('about.strengths')}</h4>
      </Reveal>
      <RevealGroup className="chip-row" stagger={38} base={90}>
        {additional.strengths.map((s) => (
          <span className="chip" key={s}>
            {s}
          </span>
        ))}
      </RevealGroup>

      <Reveal variant="fade" delay={40}>
        <h4>{t('about.interests')}</h4>
      </Reveal>
      <RevealGroup className="chip-row" stagger={38} base={90}>
        {additional.interests.map((s) => (
          <span className="chip" key={s}>
            {s}
          </span>
        ))}
      </RevealGroup>
    </div>
  );
}