import { useRef, useState } from 'react';
import useContent from '../data/useContent';
import { useLocale } from '../i18n/useLocale';

function run(cmd, print, { t, profile, skills, experience }) {
  const c = cmd.trim().toLowerCase();
  if (c === '') return;
  if (c === 'help') return print(t('terminal.help').join('\n'));
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
    return print(t('terminal.hireMe'));
  }
  return print(t('terminal.notFound', { cmd }));
}

export default function TerminalApp() {
  const { t } = useLocale();
  const { profile, skills, experience } = useContent();
  const [lines, setLines] = useState(() => [t('terminal.intro')]);
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
    run(value, print, { t, profile, skills, experience });
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
          aria-label={t('terminal.commandLabel')}
        />
      </form>
    </div>
  );
}
