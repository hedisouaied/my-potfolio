import useContent from '../data/useContent';

export default function SkillsApp() {
  const { skills } = useContent();

  return (
    <div className="app-pad">
      {Object.entries(skills).map(([group, items]) => (
        <div className="skill-group" key={group}>
          <h4>{group}</h4>
          <div className="chip-row">
            {items.map((item) => <span className="chip" key={item}>{item}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}
