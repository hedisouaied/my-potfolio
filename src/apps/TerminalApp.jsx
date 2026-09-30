import { useRef, useState } from 'react';
import { profile, skills, experience } from '../data/profile';

const HELP = [
  'Available commands:',
  '  help        show this list',
  '  whoami      who am I looking at',
  '  about       a short summary',
  '  skills      list core skills',
  '  experience  list work history',
  '  contact     how to reach me',
  '  clear       clear the screen',
];

function run(cmd, print) {
  const c = cmd.trim().toLowerCase();
  if (c === '') return;
  if (c === 'help') return print(HELP.join('\n'));
  if (c === 'whoami') return print(`${profile.name} — ${profile.role}`);
  if (c === 'about') return print(profile.summary);
  if (c === 'skills') return print(Object.values(skills).flat().join(', '));
  if (c === 'experience') {
    return print(
      experience.map((e) => `${e.period}  ${e.title} — ${e.company}`).join('\n')
    );
  }
  if (c === 'contact') {
    return print(`${profile.email}\n${profile.phone}\n${profile.website}`);
  }
  if (c === 'sudo hire-me' || c === 'sudo hireme') {
    return print('Permission granted. Opening the Contact app is the fastest way.');
  }
  return print(`command not found: ${cmd}\ntype 'help' for a list of commands`);
}

export default function TerminalApp() {
  const [lines, setLines] = useState([
    `H.Souaied terminal — type 'help' to get started`,
  ]);
  const [value, setValue] = useState('');
  const scrollRef = useRef(null);

  const print = (text) => {
    setLines((ls) => [...ls, text]);
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });
  };

  const submit = (e) => {
    e.preventDefault();
    setLines((ls) => [...ls, `$ ${value}`]);
    run(value, print);
    setValue('');
  };

  return (
    <div className="terminal" ref={scrollRef}>
      {lines.map((l, i) => (
        <pre key={i} className="terminal-line">{l}</pre>
      ))}
      <form onSubmit={submit} className="terminal-input-row">
        <span>$</span>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          aria-label="Terminal command"
        />
      </form>
    </div>
  );
}
