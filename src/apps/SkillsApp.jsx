import useContent from '../data/useContent';
import { Reveal, RevealGroup } from '../motion/Reveal';

export default function SkillsApp() {
  const { skills } = useContent();

  return (
    <div className="app-pad">
      {Object.entries(skills).map(([group, items]) => (
        <Reveal key={group} variant="up" className="skill-group">
          <h4>{group}</h4>
          <RevealGroup className="chip-row" stagger={34}>
            {items.map((item) => (
              <span className="chip" key={item}>
                {item}
              </span>
            ))}
          </RevealGroup>
        </Reveal>
      ))}
    </div>
  );
}