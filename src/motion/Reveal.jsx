import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react';
import { observeReveal } from './revealObserver';
import { prefersReducedMotion } from './lerp';

/**
 * Scroll-triggered reveal for a single element.
 *
 * The hidden state is a class, not inline styles, so all the motion design lives
 * in index.css and stays inspectable/tunable in one place.
 */
export function Reveal({
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  className = '',
  style,
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(prefersReducedMotion);

  useEffect(() => observeReveal(ref.current, () => setShown(true)), []);

  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant}${shown ? ' is-in' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * Staggered reveal for a list of children, observed as one unit.
 *
 * One observer entry drives the whole group; each child reads its own index from
 * `--i` and derives its delay in CSS. That keeps the per-item cost to a single
 * custom property and avoids N observers or N re-renders.
 */
export function RevealGroup({
  as: Tag = 'div',
  stagger = 55,
  base = 0,
  className = '',
  style,
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(prefersReducedMotion);

  useEffect(() => observeReveal(ref.current, () => setShown(true)), []);

  const items = Children.map(children, (child, i) => {
    if (!isValidElement(child)) return child;
    return cloneElement(child, {
      className: `${child.props.className ?? ''} reveal-item`.trim(),
      style: { ...child.props.style, '--i': i },
    });
  });

  return (
    <Tag
      ref={ref}
      className={`reveal-stagger${shown ? ' is-in' : ''} ${className}`.trim()}
      style={{ '--stagger-base': `${base}ms`, '--dur-stagger': `${stagger}ms`, ...style }}
      {...rest}
    >
      {items}
    </Tag>
  );
}

export default Reveal;