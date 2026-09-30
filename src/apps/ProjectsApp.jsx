import { projects } from '../data/profile';

export default function ProjectsApp() {
  return (
    <div className="app-pad">
      <div className="project-grid">
        {projects.map((p) => (
          <div className="project-card" key={p.title}>
            <span className="tag">{p.tag}</span>
            <h4>{p.title}</h4>
            <p className="muted small">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
