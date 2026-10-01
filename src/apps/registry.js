import AboutApp from './AboutApp';
import ResumeApp from './ResumeApp';
import SkillsApp from './SkillsApp';
import ProjectsApp from './ProjectsApp';
import ContactApp from './ContactApp';
import TerminalApp from './TerminalApp';
import TicTacToeApp from './TicTacToeApp';
import MusicApp from './MusicApp';

export const APPS = {
  about: { title: 'About Me', icon: 'about', component: AboutApp, w: 500, h: 500 },
  resume: { title: 'Resume', icon: 'resume', component: ResumeApp, w: 640, h: 560 },
  skills: { title: 'Skills', icon: 'skills', component: SkillsApp, w: 540, h: 500 },
  projects: { title: 'Projects', icon: 'projects', component: ProjectsApp, w: 560, h: 440 },
  contact: { title: 'Contact', icon: 'contact', component: ContactApp, w: 460, h: 340 },
  terminal: { title: 'Terminal', icon: 'terminal', component: TerminalApp, w: 580, h: 420 },
  tictactoe: { title: 'Tic-Tac-Toe', icon: 'tictactoe', component: TicTacToeApp, w: 380, h: 400 },
  music: { title: 'Music', icon: 'music', component: MusicApp, w: 440, h: 600 },
};

export const DESKTOP_ICONS = ['about', 'resume', 'skills', 'projects', 'contact', 'terminal', 'tictactoe', 'music'];
