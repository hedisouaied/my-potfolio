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
            <h4>{p.title}</h4>
            <p className="muted small">{p.body}</p>
          </TiltCard>
        ))}
      </RevealGroup>
    </div>
  );
}