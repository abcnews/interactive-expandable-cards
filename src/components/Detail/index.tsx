import classNames from 'classnames';
import { h } from 'preact';
import { useRef, useState, useEffect, useLayoutEffect } from 'preact/hooks';
import styles from './styles.scss';

type DetailProps = {
  open: boolean;
  nodes: HTMLElement[];
};

const TABBABLE_SELECTOR = '[href], button, input:not([type="hidden"]), select, textarea, [tabindex]';

export const Detail = ({ open, nodes }: DetailProps) => {
  const contentRef = useRef<HTMLDivElement>();
  const baseRef = useRef<HTMLDivElement>();
  const [tabbable, setTabbable] = useState<{ el: Element; initial: string | null }[]>([]);

  const animateHeightChange = () => {
    if (baseRef.current instanceof HTMLElement) {
      const el = baseRef.current;
      el.style.height = `${contentRef.current.clientHeight}px`;
      setTimeout(
        () => {
          el.style.height = open ? 'auto' : '0';
        },
        open ? 250 : 0
      );
    }
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
      contentRef.current.appendChild(node);
    });

    setTabbable(
      Array.from(contentRef.current.querySelectorAll(TABBABLE_SELECTOR)).map(el => ({
        el,
        initial: el.getAttribute('tabindex')
      }))
    );

    return () => {
      while (contentRef.current.firstChild) {
        contentRef.current.firstChild.remove();
      }
      setTabbable([]);
    };
  }, [nodes]);

  useLayoutEffect(() => {
    animateHeightChange();
  }, [open]);

  return (
    <div ref={baseRef} className={classNames(styles.root, { [styles.open]: open })} data-component="Detail">
      <div ref={contentRef} className={`${styles.content} u-richtext`} />
    </div>
  );
};
