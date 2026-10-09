import useContent from '../data/useContent';
import TiltCard from '../motion/TiltCard';
import { RevealGroup } from '../motion/Reveal';

export default function ProjectsApp() {
  const { projects } = useContent();

  return (
    <div className="app-pad">
      <RevealGroup className="project-grid" stagger={70}>
        {projects.map((p) => (
          <TiltCard key={p.title} className="project-card" max={6}>
            <span className="project-sheen" aria-hidden="true" />
            <span className="tag">{p.tag}</span>
            <h4>
              {p.url ? (
                <a
                  className="project-link"
                  href={`https://${p.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {p.title}
                </a>
              ) : (
                p.title
              )}
            </h4>
            <p className="muted small">{p.body}</p>
            {p.tech?.length ? (
              <div className="project-tech chip-row">
                {p.tech.map((t) => (
                  <span className="chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </TiltCard>
        ))}
      </RevealGroup>
    </div>
  );
}