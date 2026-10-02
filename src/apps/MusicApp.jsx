import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale } from '../i18n/useLocale';
import jazzRestaurant from '../assets/music/alex-morgan-jazz-restaurant-music-563578.mp3';
import sunnyCafe from '../assets/music/alex-morgan-jazz-song-sunny-cafe-nu-jazz-587413.mp3';
import smoothJazz from '../assets/music/alex-morgan-smooth-jazz-restaurant-568175.mp3';
import gypsyJazz from '../assets/music/aurectheme-gypsy-jazz-596436.mp3';

const TRACKS = [
  { title: 'Jazz Restaurant', artist: 'Alex Morgan', src: jazzRestaurant },
  { title: 'Sunny Café Nu Jazz', artist: 'Alex Morgan', src: sunnyCafe },
  { title: 'Smooth Jazz', artist: 'Alex Morgan', src: smoothJazz },
  { title: 'Gypsy Jazz', artist: 'Aurectheme', src: gypsyJazz },
];

const BARS = 32;
const RESTART_AFTER = 3;

const fmt = (s) => {
  if (!Number.isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

/* A real range input (keyboard + screen-reader friendly) laid over a custom
   track, so the fill can be styled without fighting vendor pseudo-elements. */
function Slider({ value, max, onChange, disabled, label, className = '' }) {
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  return (
    <div className={`mus-slider ${className} ${disabled ? 'off' : ''}`}>
      <div className="mus-slider-fill" style={{ transform: `scaleX(${pct})` }} />
      <input
        className="mus-slider-input"
        type="range"
        min="0"
        max={max}
        step="0.01"
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-label={label}
      />
    </div>
  );
}

export default function MusicApp() {
  const { t } = useLocale();
  const audioRef = useRef(null);
  const barRefs = useRef([]);
  const graphRef = useRef(null);
  const rafRef = useRef(0);
  /* Playback intent, because swapping src resets the element — see goTo. */
  const wantPlayRef = useRef(false);
  const indexRef = useRef(0);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const track = TRACKS[index];

  /* Web Audio graph for the spectrum. Created lazily on the first user gesture
     and only once per element — createMediaElementSource throws on a second
     call for the same <audio>. */
  const ensureGraph = useCallback(() => {
    if (graphRef.current !== null) return graphRef.current;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    const el = audioRef.current;
    if (!Ctor || !el) {
      graphRef.current = false;
      return false;
    }
    try {
      const ctx = new Ctor();
      const source = ctx.createMediaElementSource(el);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.72;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      graphRef.current = { ctx, analyser, data: new Uint8Array(analyser.frequencyBinCount) };
    } catch {
      graphRef.current = false;
    }
    return graphRef.current;
  }, []);

  /* Bars are driven straight from rAF rather than state — 32 setState calls per
     frame would re-render the whole window 60 times a second. */
  const paint = useCallback((value) => {
    for (let i = 0; i < BARS; i++) {
      const bar = barRefs.current[i];
      if (bar) bar.style.setProperty('--v', value(i));
    }
  }, []);

  const loop = useCallback(function loop() {
    const g = graphRef.current;
    if (g) {
      g.analyser.getByteFrequencyData(g.data);
      const usable = Math.floor(g.data.length * 0.72);
      paint((i) => {
        const bin = g.data[Math.min(usable - 1, Math.floor((i / BARS) * usable))] / 255;
        return Math.max(0.05, bin).toFixed(3);
      });
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [paint]);

  const stopLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    paint(() => '0.05');
  }, [paint]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const g = ensureGraph();
    if (g) {
      if (g.ctx.state === 'suspended') g.ctx.resume();
      if (!rafRef.current) rafRef.current = requestAnimationFrame(loop);
    }
    audio.play().catch(() => setPlaying(false));
  }, [ensureGraph, loop]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    stopLoop();
  }, [stopLoop]);

  const toggle = useCallback(() => {
    if (playing) pause();
    else play();
  }, [playing, pause, play]);

  /* Only records intent. React swaps the <audio src> on the next render, and
     changing src runs the media load algorithm which pauses the element — so
     starting playback has to wait until that commit lands (see the index
     effect below), otherwise switching tracks always lands on "paused". */
  const goTo = useCallback((i, autoplay) => {
    wantPlayRef.current = autoplay;
    setIndex(((i % TRACKS.length) + TRACKS.length) % TRACKS.length);
    setTime(0);
    setDuration(0);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (wantPlayRef.current) audio.play().catch(() => { });
    else audio.pause();
  }, [index]);

  /* Previous restarts the current track first, like every other player. */
  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > RESTART_AFTER) {
      audio.currentTime = 0;
      setTime(0);
      return;
    }
    goTo(indexRef.current - 1, playing);
  }, [goTo, playing]);

  const next = useCallback(() => goTo(indexRef.current + 1, playing), [goTo, playing]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    const onTime = () => setTime(audio.currentTime);
    const onMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => goTo(indexRef.current + 1, true);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('durationchange', onMeta);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('durationchange', onMeta);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnd);
    };
  }, [goTo]);

  /* A window can unmount at any time (close, minimise). Stop the audio and drop
     the AudioContext so nothing keeps playing from a dead component. */
  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current);
      const audio = audioRef.current;
      if (audio) audio.pause();
      const g = graphRef.current;
      if (g && g.ctx && g.ctx.state !== 'closed') g.ctx.close().catch(() => { });
    },
    []
  );

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const seek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = Number(e.target.value);
    setTime(audio.currentTime);
  };

  return (
    <div className="app-pad mus">
      <audio ref={audioRef} src={track.src} preload="metadata" />

      <div className="mus-stage">
        <div className={`mus-disc ${playing ? 'spin' : ''}`}>
          <div className="mus-grooves" />
        </div>

        <div className="mus-now">
          <span className="mus-eyebrow">{t('music.nowPlaying')}</span>
          <p className="mus-title">{track.title}</p>
          <p className="mus-artist">{track.artist}</p>
          <div className="mus-spectrum" aria-hidden="true">
            {Array.from({ length: BARS }, (_, i) => (
              <span
                key={i}
                className="mus-bar"
                ref={(el) => {
                  barRefs.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mus-scrub">
        <span className="mus-time">{fmt(time)}</span>
        <Slider
          value={Math.min(time, duration || 0)}
          max={duration || 1}
          onChange={seek}
          disabled={!duration}
          label={t('music.seek')}
        />
        <span className="mus-time">{fmt(duration)}</span>
      </div>

      <div className="mus-controls">
        <button type="button" className="mus-btn" onClick={prev} aria-label={t('music.previousTrack')} title={t('music.previous')}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M7 5h2.4v14H7zM19 5.4v13.2a.7.7 0 0 1-1.08.59l-8.4-5.9a1.1 1.1 0 0 1 0-1.78l8.4-5.9A.7.7 0 0 1 19 5.4Z" />
          </svg>
        </button>

        <button
          type="button"
          className={`mus-btn mus-btn-main ${playing ? 'on' : ''}`}
          onClick={toggle}
          aria-label={playing ? t('music.pause') : t('music.play')}
          title={playing ? t('music.pause') : t('music.play')}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M8 5h3.2v14H8zM12.8 5H16v14h-3.2z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M8 5.3v13.4a.7.7 0 0 0 1.07.6l10.6-6.7a.7.7 0 0 0 0-1.2L9.07 4.7A.7.7 0 0 0 8 5.3Z" />
            </svg>
          )}
        </button>

        <button type="button" className="mus-btn" onClick={next} aria-label={t('music.nextTrack')} title={t('music.next')}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M14.6 5H17v14h-2.4zM5 5.4v13.2a.7.7 0 0 0 1.08.59l8.4-5.9a1.1 1.1 0 0 0 0-1.78l-8.4-5.9A.7.7 0 0 0 5 5.4Z" />
          </svg>
        </button>

        <div className="mus-volume">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            <path d="M4 9.5h3.4L12 5.6v12.8L7.4 14.5H4z" />
            {volume > 0.02 && <path d="M15.6 9.2a4 4 0 0 1 0 5.6" />}
            {volume > 0.55 && <path d="M18.4 6.6a7.8 7.8 0 0 1 0 10.8" />}
          </svg>
          <Slider
            value={volume}
            max={1}
            onChange={(e) => setVolume(Number(e.target.value))}
            label={t('music.volume')}
          />
        </div>
      </div>

      <h4>{t('music.tracks')}</h4>
      <ol className="mus-list">
        {TRACKS.map((entry, i) => (
          <li key={entry.src}>
            <button
              type="button"
              className={`mus-track ${i === index ? 'active' : ''}`}
              onClick={() => goTo(i, true)}
              aria-current={i === index}
            >
              <span className="mus-track-no">
                {i === index && playing ? (
                  <span className="mus-eq" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                ) : (
                  String(i + 1).padStart(2, '0')
                )}
              </span>
              <span className="mus-track-text">
                <span className="mus-track-title">{entry.title}</span>
                <span className="mus-track-artist">{entry.artist}</span>
              </span>
              <span className="mus-track-state">{i === index ? (playing ? t('music.playing') : t('music.paused')) : ''}</span>
            </button>
          </li>
        ))}
      </ol>

      <span className="mus-sr" aria-live="polite">
        {t(playing ? 'music.announcePlaying' : 'music.announcePaused', {
          title: track.title,
          artist: track.artist,
        })}
      </span>
    </div>
  );
}