import useContent from '../data/useContent';

export default function ProjectsApp() {
  const { projects } = useContent();

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
