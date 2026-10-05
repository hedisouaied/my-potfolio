import AppIcon from '../components/AppIcon';
import cvPdf from '../assets/my-cv.pdf';
import { useLocale } from '../i18n/useLocale';

/* Vite turns this import into a hashed, same-origin URL for the real file, which
   is what makes both the embed and the `download` attribute work. */
const CV_FILE = 'Hedi-Souaied-CV.pdf';

export default function CvApp() {
  const { t } = useLocale();

  return (
    <div className="cv-app">
      <div className="cv-bar">
        <span className="cv-bar-meta">my-cv.pdf</span>
        <div className="cv-bar-actions">
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
        </div>
      </div>

      <div className="cv-frame">
        {/* `object` over `iframe`: browsers without a built-in PDF viewer fall back
            to the inline message + link instead of an empty white rectangle. */}
        <object data={cvPdf} type="application/pdf" className="cv-embed" aria-label={t('apps.cv')}>
          <p className="muted">{t('cv.fallback')}</p>
          <a className="cv-fallback-link" href={cvPdf} download={CV_FILE}>
            {t('cv.download')}
          </a>
        </object>
      </div>
    </div>
  );
}