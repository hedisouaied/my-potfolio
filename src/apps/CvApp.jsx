import AppIcon from '../components/AppIcon';
import cvPdf from '../assets/my-cv.pdf';
import { useLocale } from '../i18n/useLocale';
import { Reveal, RevealGroup } from '../motion/Reveal';

/* Vite turns this import into a hashed, same-origin URL for the real file, which
   is what makes both the embed and the `download` attribute work. */
const CV_FILE = 'Hedi-Souaied-CV.pdf';

export default function CvApp() {
  const { t } = useLocale();

  return (
    <div className="cv-app">
      <div className="cv-bar">
        <span className="cv-bar-meta">my-cv.pdf</span>
        <RevealGroup className="cv-bar-actions" stagger={70}>
          <a
            className="btn-ghost cv-btn"
            href={cvPdf}
            target="_blank"
            rel="noopener noreferrer"
            title={t('cv.openNewTab')}
          >
            <AppIcon name="external" size={15} />
            {t('cv.openNewTab')}
          </a>
          <a className="btn-primary cv-btn" href={cvPdf} download={CV_FILE}>
            <AppIcon name="download" size={15} />
            {t('cv.download')}
          </a>
        </RevealGroup>
      </div>

      <div className="cv-frame">
        {/* `object` over `iframe`: browsers without a built-in PDF viewer render the
            fallback children instead of an empty white rectangle. */}
        <Reveal
          as="object"
          delay={120}
          variant="scale"
          className="cv-embed"
          data={cvPdf}
          type="application/pdf"
          aria-label={t('apps.cv')}
        >
          <p className="muted">{t('cv.fallback')}</p>
          <a className="cv-fallback-link" href={cvPdf} download={CV_FILE}>
            {t('cv.download')}
          </a>
        </Reveal>
      </div>
    </div>
  );
}