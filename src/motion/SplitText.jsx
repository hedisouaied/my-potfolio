/**
 * Splits a string into animatable parts.
 *
 * Returns words as `inline-block` wrappers (so they wrap naturally) with the
 * characters inside them as individual inline-block spans. Keeping the spaces as
 * real text nodes between words means screen readers still announce the sentence
 * normally, and `white-space: pre-wrap` preserves them visually.
 */
export default function SplitText({
  text = '',
  mode = 'chars',
  className = '',
  style,
  ...rest
}) {
  const words = String(text).split(' ');

  return (
    <span className={`split ${className}`.trim()} style={style} {...rest}>
      {words.map((word, w) => (
        <span className="split-word" key={`${word}-${w}`}>
          {mode === 'words' ? (
            <span className="split-word-unit" style={{ '--i': w }}>
              {word}
            </span>
          ) : (
            [...word].map((char, c) => (
              <span
                className="split-char"
                key={`${char}-${c}`}
                style={{ '--i': w * 100 + c }}
              >
                {char}
              </span>
            ))
          )}
        </span>
      ))}
    </span>
  );
}