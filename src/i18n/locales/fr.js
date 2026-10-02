export default {
  apps: {
    about: 'À propos',
    resume: 'CV',
    skills: 'Compétences',
    projects: 'Projets',
    contact: 'Contact',
    terminal: 'Terminal',
    tictactoe: 'Morpion',
    music: 'Musique',
  },

  wallpapers: {
    portrait: 'Portrait',
    nebula: 'Nébuleuse',
    grid: 'Plan',
    violet: 'Brume violette',
    matrix: 'Matrice',
    ember: 'Braise',
  },

  taskbar: {
    changeWallpaper: "Changer le fond d'écran — actuel : {name}",
    wallpaper: "Fond d'écran : {name}",
    language: 'Langue',
    changeLanguage: "Changer de langue — actuelle : {name}",
  },

  window: {
    minimize: 'Réduire',
    maximize: 'Agrandir',
    restore: 'Restaurer',
    close: 'Fermer',
  },

  boot: {
    lines: [
      'H.SouaiedOS bootloader v1.0',
      'initialisation du noyau',
      'montage de /home/hsouaied',
      'chargement de /projects',
      'chargement de /assets',
      'démarrage du gestionnaire de fenêtres',
      "calibration du fond d'écran",
    ],
    ok: 'ok',
    ready: 'prêt',
  },

  sideTerm: {
    lines: [
      'bienvenue dans mon univers...',
      'utilisateur : Hedi Souaied',
      'rôle : Développeur PHP / Laravel',
      'passion : transformer le café en code',
      'création d’applications web...',
      'débogage de la réalité... veuillez patienter',
      '99 bugs trouvés... on répare le café d’abord',
      'ça marche sur ma machine... probablement',
      'transformer des idées en code fonctionnel',
      'système prêt. Construisons quelque chose de génial !',
    ],
  },

  terminal: {
    intro: "Terminal H.Souaied — tapez 'help' pour commencer",
    commandLabel: 'Commande du terminal',
    help: [
      'Commandes disponibles :',
      '  help        afficher cette liste',
      '  whoami      qui ai-je sous les yeux',
      '  about       un court résumé',
      '  skills      lister les compétences clés',
      '  experience  lister le parcours professionnel',
      '  contact     comment me joindre',
      '  clear       effacer l’écran',
    ],
    notFound: "commande introuvable : {cmd}\ntapez 'help' pour la liste des commandes",
    hireMe: 'Autorisation accordée. Le plus rapide reste d’ouvrir l’application Contact.',
  },

  about: {
    strengths: 'Forces',
    interests: "Centre d'intérêts",
  },

  resume: {
    experience: 'Expérience',
    education: 'Formation',
    certifications: 'Certifications',
  },

  contact: {
    title: 'Parlons-nous',
    subtitle: 'Ouvert aux projets full-stack Laravel & Filament.',
  },

  music: {
    nowPlaying: 'Lecture en cours',
    seek: 'Position',
    play: 'Lecture',
    pause: 'Pause',
    previous: 'Précédent',
    next: 'Suivant',
    previousTrack: 'Piste précédente',
    nextTrack: 'Piste suivante',
    volume: 'Volume',
    tracks: 'Pistes',
    playing: 'En lecture',
    paused: 'En pause',
    announcePlaying: '{title} par {artist}, en lecture',
    announcePaused: '{title} par {artist}, en pause',
  },

  tictactoe: {
    draw: 'Échec nul',
    youWin: 'Vous avez gagné !',
    cpuWins: 'H.Souaied gagne !',
    yourTurn: 'À vous de jouer (X)',
    thinking: 'H.Souaied réfléchit…',
    cell: 'Case {n} : {value}',
    cellEmpty: 'Case {n} : vide',
    reset: 'Réinitialiser',
  },
};
