import classNames from 'classnames';
import { FunctionalComponent, h } from 'preact';
import { useRef, useState, useEffect, useLayoutEffect } from 'preact/hooks';
import styles from './styles.scss';

type DetailProps = {
  open: boolean;
  nodes: HTMLElement[];
};

const TABBABLE_SELECTOR = '[href], button, input:not([type="hidden"]), select, textarea, [tabindex]';

export const Detail: FunctionalComponent<DetailProps> = ({ open, nodes }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const [tabbable, setTabbable] = useState<{ el: Element; initial: string | null }[]>([]);
  const timeoutRef = useRef<number>();

  const animateHeightChange = (el: HTMLElement) => {
    el.style.height = `${contentRef.current?.clientHeight || 0}px`;
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(
      () => {
        el.style.height = open ? 'auto' : '0';
      },
      open ? 250 : 0
    );
  };

  const fixImages = (el: HTMLElement) => {
    const figsImages = Array.from(el.querySelectorAll<HTMLImageElement>('figure img'));
    figsImages.forEach(img => {
      img.setAttribute('src', img.dataset.src || '');
      img.dataset.nojs = 'false';
    });
  };

  tabbable.forEach(x => {
    if (open) {
      if (x.initial === null) {
        x.el.removeAttribute('tabindex');
      } else {
        x.el.setAttribute('tabindex', x.initial);
      }
    } else {
      x.el.setAttribute('tabindex', '-1');
    }
  });

  useEffect(() => {
    nodes.forEach(node => {
      contentRef.current?.appendChild(node);
    });

    setTabbable(
      Array.from(contentRef.current?.querySelectorAll(TABBABLE_SELECTOR) || []).map(el => ({
        el,
        initial: el.getAttribute('tabindex')
      }))
    );

    return () => {
      while (contentRef.current?.firstChild) {
        contentRef.current.firstChild.remove();
      }
      setTabbable([]);
    };
  }, [nodes]);

  useLayoutEffect(() => {
    const container = baseRef.current;
    if (container instanceof HTMLElement) {
      animateHeightChange(container);
      fixImages(container);
    }
  }, [open]);

  return (
    <div ref={baseRef} className={classNames(styles.root, { [styles.open]: open })} data-component="Detail">
      <div ref={contentRef} className={`${styles.content} u-richtext`} />
    </div>
  );
};

export default Detail;
