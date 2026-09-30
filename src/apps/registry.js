import AboutApp from './AboutApp';
import ResumeApp from './ResumeApp';
import SkillsApp from './SkillsApp';
import ProjectsApp from './ProjectsApp';
import ContactApp from './ContactApp';
import TerminalApp from './TerminalApp';
import TicTacToeApp from './TicTacToeApp';

export const APPS = {
  about: { title: 'About Me', icon: '☺', component: AboutApp, w: 480, h: 480 },
  resume: { title: 'Resume', icon: '🎓', component: ResumeApp, w: 620, h: 540 },
  skills: { title: 'Skills', icon: '⚙', component: SkillsApp, w: 520, h: 480 },
  projects: { title: 'Projects', icon: '💼', component: ProjectsApp, w: 560, h: 420 },
  contact: { title: 'Contact', icon: '✉', component: ContactApp, w: 440, h: 320 },
  terminal: { title: 'Terminal', icon: '›_', component: TerminalApp, w: 560, h: 400 },
  tictactoe: { title: 'Tic-Tac-Toe', icon: '✕○', component: TicTacToeApp, w: 360, h: 420 },
};

export const DESKTOP_ICONS = ['about', 'resume', 'skills', 'projects', 'contact', 'terminal', 'tictactoe'];
