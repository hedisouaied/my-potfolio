import useContent from '../data/useContent';
import { useLocale } from '../i18n/useLocale';
import { Reveal, RevealGroup } from '../motion/Reveal';

export default function ResumeApp() {
  const { experience, education, certifications } = useContent();
  const { t } = useLocale();

  return (
    <div className="app-pad">
      <Reveal variant="fade">
        <h3>{t('resume.experience')}</h3>
      </Reveal>
      <RevealGroup as="ol" className="timeline" stagger={85}>
        {experience.map((role) => (
          <li key={role.company + role.period}>
            <p className="tl-period">{role.period}</p>
            <h4>
              {role.title} <span className="muted">— {role.company}</span>
            </h4>
            <p className="muted small">{role.place}</p>
            <ul>
              {role.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </li>
        ))}
      </RevealGroup>

      <Reveal variant="fade">
        <h3>{t('resume.education')}</h3>
      </Reveal>
      <RevealGroup as="ol" className="timeline" stagger={85}>
        {education.map((e) => (
          <li key={e.title}>
            <p className="tl-period">{e.period}</p>
            <h4>{e.title}</h4>
            <p className="muted small">{e.place}</p>
          </li>
        ))}
      </RevealGroup>

      <Reveal variant="fade">
        <h3>{t('resume.certifications')}</h3>
      </Reveal>
      <RevealGroup as="ul" className="cert-list" stagger={60}>
        {certifications.map((c) => (
          <li key={c.title}>
            <span>{c.title}</span>
            <span className="muted small">
              {c.issuer} · {c.year}
            </span>
          </li>
        ))}
      </RevealGroup>
    </div>
  );
}