export default {
  apps: {
    about: 'About Me',
    resume: 'Resume',
    skills: 'Skills',
    projects: 'Projects',
    contact: 'Contact',
    terminal: 'Terminal',
    tictactoe: 'Tic-Tac-Toe',
    music: 'Music',
    cv: 'CV Preview',
  },

  wallpapers: {
    portrait: 'Portrait',
    nebula: 'Nebula',
    grid: 'Blueprint',
    violet: 'Violet Haze',
    matrix: 'Matrix',
    ember: 'Ember',
  },

  taskbar: {
    changeWallpaper: 'Change wallpaper — current: {name}',
    wallpaper: 'Wallpaper: {name}',
    apps: 'All apps',
    openApp: 'Open {name}',
    language: 'Language',
    changeLanguage: 'Change language — current: {name}',
  },

  window: {
    minimize: 'Minimize',
    maximize: 'Maximize',
    restore: 'Restore',
    close: 'Close',
  },

  boot: {
    lines: [
      'H.SouaiedOS bootloader v1.0',
      'initializing kernel',
      'mounting /home/hsouaied',
      'loading /projects',
      'loading /assets',
      'starting window manager',
      'calibrating wallpaper',
    ],
    ok: 'ok',
    ready: 'ready',
  },

  sideTerm: {
    lines: [
      'welcome to my world...',
      'user: Hedi Souaied',
      'role: PHP / Laravel Developer',
      'passion: turning coffee into code',
      'building web applications...',
      'debugging reality... please wait',
      '99 bugs found... fixing the coffee first',
      'works on my machine... probably',
      'converting ideas into working code',
      "system ready. Let's build something great!",
    ],
  },

  terminal: {
    intro: "H.Souaied terminal — type 'help' to get started",
    commandLabel: 'Terminal command',
    help: [
      'Available commands:',
      '  help        show this list',
      '  whoami      who am I looking at',
      '  about       a short summary',
      '  skills      list core skills',
      '  experience  list work history',
      '  contact     how to reach me',
      '  clear       clear the screen',
    ],
    notFound: "command not found: {cmd}\ntype 'help' for a list of commands",
    hireMe: 'Permission granted. Opening the Contact app is the fastest way.',
  },

  about: {
    strengths: 'Strengths',
    interests: 'Interests',
  },

  resume: {
    experience: 'Experience',
    education: 'Education',
    certifications: 'Certifications',
  },

  cv: {
    download: 'Download',
    openNewTab: 'Open in new tab',
    fallback: 'Your browser cannot display PDF files.',
  },

  contact: {
    title: "Let's talk",
    subtitle: 'Open to full-stack Laravel & Filament work.',
  },

  music: {
    nowPlaying: 'Now playing',
    seek: 'Seek',
    play: 'Play',
    pause: 'Pause',
    previous: 'Previous',
    next: 'Next',
    previousTrack: 'Previous track',
    nextTrack: 'Next track',
    volume: 'Volume',
    tracks: 'Tracks',
    playing: 'Playing',
    paused: 'Paused',
    announcePlaying: '{title} by {artist}, playing',
    announcePaused: '{title} by {artist}, paused',
  },

  tictactoe: {
    draw: "It's a draw",
    youWin: 'You win!',
    cpuWins: 'H.Souaied wins!',
    yourTurn: 'Your turn (X)',
    thinking: 'H.Souaied is thinking…',
    cell: 'Cell {n}: {value}',
    cellEmpty: 'Cell {n}: empty',
    reset: 'Reset board',
  },
};
