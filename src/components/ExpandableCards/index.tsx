import { h, Fragment } from 'preact';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Control } from '../Control';
import { Detail } from '../Detail';
import styles from './styles.scss';

type ExpandableCardsProps = {
  items: ExpandableCardsItem[];
  config: ExpandableCardsItemConfig;
};

type ExpandableCardsState = {
  itemsPerRow: number;
  id: number;
  openIndex: number | null;
  toggling: boolean;
};

export type ExpandableCardsItem = {
  label: string;
  image: string;
  title: string;
  detail: HTMLElement[];
  config: ExpandableCardsItemConfig;
};

export type ExpandableCardsItemConfig = {};

const INITIAL_ITEMS_PER_ROW = 2;
const MAX_ALLOWED_CATEGORIES = 6;

let nextId = 0;

export const ExpandableCards = ({ items, config }: ExpandableCardsProps) => {
  const baseRef = useRef<HTMLDListElement>();
  const [itemsOpened, setItemsOpened] = useState<number[]>([]);
  const [logged, setLogged] = useState<boolean>(false);
  const [measurementIntervalId, setMeasurementIntervalId] = useState<number | undefined>(undefined);
  const [id, setId] = useState<number>(nextId++);
  const [itemsPerRow, setItemsPerRow] = useState<number>(INITIAL_ITEMS_PER_ROW);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isToggling, setIsToggling] = useState<boolean>(false);

  // TODO: this should be observed in a way that doesn't involve intervals.
  const measureBase = () => {
    const width = baseRef.current.offsetWidth;
    if (width >= 1480) {
      setItemsPerRow(6);
    } else if (width >= 1200) {
      setItemsPerRow(5);
    } else if (width >= 940) {
      setItemsPerRow(4);
    } else if (width >= 480) {
      setItemsPerRow(3);
    } else if (width >= 240) {
      setItemsPerRow(2);
    } else {
      setItemsPerRow(1);
    }
  };

  useEffect(() => {
    measureBase();
    setMeasurementIntervalId(window.setInterval(measureBase, 250));

    return () => {
      window.clearInterval(measurementIntervalId);
    };
  }, []);

  // TODO: Move this outside the component.
  useLayoutEffect(() => {
    // Integrate with Odyssey
    const integrateWithOdyssey = () => {
      if (baseRef.current.parentElement) {
        baseRef.current.parentElement.classList.remove('u-richtext');
        baseRef.current.parentElement.classList.add('u-pull');
      }
    };
    if (window.__ODYSSEY__) {
      integrateWithOdyssey();
    } else {
      window.addEventListener('odyssey:api', integrateWithOdyssey);
    }

    // Integrate with phase 1 mobile
    if (baseRef.current.parentElement && baseRef.current.parentElement.className.indexOf('embed-wysiwyg') > -1) {
      baseRef.current.parentElement.classList.add(styles.borderless);
    }
  });

  const onNavigate = (index: number, event: KeyboardEvent) => {
    let nextIndex = index;

    // TODO: use KeyboardEvent.key instead: https://kapeli.com/dash_share?docset_file=JavaScript&docset_name=JavaScript&path=developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values.html&platform=javascript&repo=Main&source=developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
    switch (event.keyCode) {
      case 37:
        nextIndex--;
        break;
      case 38:
        nextIndex -= itemsPerRow;
        break;
      case 39:
        nextIndex++;
        break;
      case 40:
        nextIndex += itemsPerRow;
        break;
      default:
        nextIndex = -1;
        break;
    }

    if (nextIndex > -1 && nextIndex < items.length) {
      event.preventDefault();
      Array.from(baseRef.current.querySelectorAll('[data-component="Control"]')).forEach((el, index) => {
        if (index === nextIndex) {
          if (el instanceof HTMLElement) el.focus();
        }
      });
    }
  };

  const onToggle = (index: number) => {
    // Don't toggle while toggling.
    if (isToggling) return;

    if (openIndex === index) {
      return setOpenIndex(null);
    } else if (openIndex === null) {
      setItemsOpened(itemsOpened.concat(index));
      setOpenIndex(index);
      return;
    }

    setIsToggling(true);
    setOpenIndex(null);

    setTimeout(() => {
      setItemsOpened(itemsOpened.concat(index));
      setOpenIndex(index);
      setIsToggling(false);
    }, 250);
  };

  const categories = items.reduce<string[]>((cats, item) => {
    if (item.label && cats.indexOf(item.label) < 0) {
      cats.push(item.label);
    }
    return cats;
  }, []);

  return (
    <dl ref={baseRef} role="presentation" className={styles.root} data-component="ExpandableCards">
      {items.map((item, index) => {
        const controlId = `ExpandableCards_${id}__Control_${index}`;
        const regionId = `ExpandableCards_${id}__Region_${index}`;
        const filterId = `ExpandableCards_${id}__Filter_${index}`;
        const order = 1 + (index % itemsPerRow) + Math.floor(index / itemsPerRow) * itemsPerRow * 2;
        return (
          <Fragment>
            <dt
              key={controlId}
              role="heading"
              aria-level="3"
              className={styles[`of${itemsPerRow}`]}
              style={{ order: order, '-webkit-order': order }}
            >
              <Control
                id={controlId}
                label={item.label}
                categoryIndex={
                  categories.length > 0 && categories.length < MAX_ALLOWED_CATEGORIES
                    ? categories.indexOf(item.label)
                    : 0
                }
                image={item.image}
                onNavigate={(ev: KeyboardEvent) => onNavigate(index, ev)}
                onToggle={() => onToggle(index)}
                open={index === openIndex}
                regionId={regionId}
                siblingsHaveLabels={categories.length > 0}
                title={item.title}
                filterId={filterId}
                config={{ ...config, ...item.config }}
              />
            </dt>
            <dd
              key={regionId}
              id={regionId}
              role="region"
              aria-hidden={index === openIndex ? 'false' : 'true'}
              aria-labelledby={controlId}
              style={{ order: order + itemsPerRow, '-webkit-order': order + itemsPerRow }}
            >
              <Detail nodes={item.detail} open={index === openIndex} />
            </dd>
          </Fragment>
        );
      })}
    </dl>
  );
};
