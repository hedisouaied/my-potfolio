import AboutApp from './AboutApp';
import ResumeApp from './ResumeApp';
import SkillsApp from './SkillsApp';
import ProjectsApp from './ProjectsApp';
import ContactApp from './ContactApp';
import TerminalApp from './TerminalApp';
import TicTacToeApp from './TicTacToeApp';
import MusicApp from './MusicApp';
import CvApp from './CvApp';

/* `titleKey` is resolved with `t()` at render time; window titles, desktop icon
   labels and taskbar buttons all read from the same key. */
export const APPS = {
  about: { titleKey: 'apps.about', icon: 'about', component: AboutApp, w: 500, h: 500 },
  resume: { titleKey: 'apps.resume', icon: 'resume', component: ResumeApp, w: 640, h: 560 },
  skills: { titleKey: 'apps.skills', icon: 'skills', component: SkillsApp, w: 540, h: 500 },
  projects: { titleKey: 'apps.projects', icon: 'projects', component: ProjectsApp, w: 620, h: 520 },
  contact: { titleKey: 'apps.contact', icon: 'contact', component: ContactApp, w: 460, h: 340 },
  terminal: { titleKey: 'apps.terminal', icon: 'terminal', component: TerminalApp, w: 580, h: 420 },
  tictactoe: { titleKey: 'apps.tictactoe', icon: 'tictactoe', component: TicTacToeApp, w: 400, h: 520 },
  music: { titleKey: 'apps.music', icon: 'music', component: MusicApp, w: 440, h: 600 },
  cv: { titleKey: 'apps.cv', icon: 'cv', component: CvApp, w: 940, h: 760 },
};

export const DESKTOP_ICONS = ['about', 'resume', 'skills', 'projects', 'contact', 'terminal', 'tictactoe', 'music', 'cv'];
