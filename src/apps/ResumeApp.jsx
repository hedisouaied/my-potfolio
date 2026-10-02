import useContent from '../data/useContent';
import { useLocale } from '../i18n/useLocale';

export default function ResumeApp() {
  const { experience, education, certifications } = useContent();
  const { t } = useLocale();

  return (
    <div className="app-pad">
      <h3>{t('resume.experience')}</h3>
      <ol className="timeline">
        {experience.map((role) => (
          <li key={role.company + role.period}>
            <p className="tl-period">{role.period}</p>
            <h4>{role.title} <span className="muted">— {role.company}</span></h4>
            <p className="muted small">{role.place}</p>
            <ul>
              {role.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </li>
        ))}
      </ol>

      <h3>{t('resume.education')}</h3>
      <ol className="timeline">
        {education.map((e) => (
          <li key={e.title}>
            <p className="tl-period">{e.period}</p>
            <h4>{e.title}</h4>
            <p className="muted small">{e.place}</p>
          </li>
        ))}
      </ol>

      <h3>{t('resume.certifications')}</h3>
      <ul className="cert-list">
        {certifications.map((c) => (
          <li key={c.title}>
            <span>{c.title}</span>
            <span className="muted small">{c.issuer} · {c.year}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
