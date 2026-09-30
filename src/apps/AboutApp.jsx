import { profile, additional } from '../data/profile';

export default function AboutApp() {
  return (
    <div className="app-pad">
      <div className="about-head">
        <div className="about-avatar">HS</div>
        <div>
          <h2>{profile.name}</h2>
          <p className="muted">{profile.role} · {profile.location}</p>
        </div>
      </div>
      <p>{profile.summary}</p>

      <div className="chip-row">
        {additional.languages.map((l) => <span className="chip" key={l}>{l}</span>)}
      </div>

      <h4>Strengths</h4>
      <div className="chip-row">
        {additional.strengths.map((s) => <span className="chip" key={s}>{s}</span>)}
      </div>

      <h4>Interests</h4>
      <div className="chip-row">
        {additional.interests.map((s) => <span className="chip" key={s}>{s}</span>)}
      </div>
    </div>
  );
}
