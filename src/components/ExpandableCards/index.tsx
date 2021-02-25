import { h, FunctionalComponent } from 'preact';
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { getColourFromLabel } from '../../lib/utils';
import Card from '../Card';
import styles from './styles.scss';

export type ExpandableCardsConfig = {
  defaultShouldTintPhoto: boolean;
  defaultCardColour: string;
  availableColours: ExpandableCardsColourMap;
};

export type ExpandableCardsItemConfig = {
  cardColour?: string;
  shouldTintPhoto?: boolean;
};

export type ExpandableCardsItem = {
  title: string;
  label: string | null;
  image: string | null;
  detail: HTMLElement[];
} & ExpandableCardsItemConfig;

export type ExpandableCardsColourMap = {
  [key: string]: string;
  default: string;
};

type ExpandableCardsProps = {
  items: ExpandableCardsItem[];
} & ExpandableCardsConfig;

const MAX_ALLOWED_CATEGORIES = 6;

// Global variable for uniquely identifying multiple instances of the ExpandableCards component.
let nextInstanceId = 0;

export const ExpandableCards: FunctionalComponent<ExpandableCardsProps> = ({
  items,
  defaultShouldTintPhoto,
  defaultCardColour,
  availableColours
}) => {
  const baseRef = useRef<HTMLDListElement>();
  const [itemsOpened, setItemsOpened] = useState<number[]>([]);
  const [measurementIntervalId, setMeasurementIntervalId] = useState<number | undefined>(undefined);
  const [instanceId] = useState<number>(nextInstanceId++);
  const [itemsPerRow, setItemsPerRow] = useState<number>(2);
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

    switch (event.key) {
      case 'ArrowLeft':
        nextIndex--;
        break;
      case 'ArrowUp':
        nextIndex -= itemsPerRow;
        break;
      case 'ArrowRight':
        nextIndex++;
        break;
      case 'ArrowDown':
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
      {items.map(({ title, label, image, detail, cardColour, shouldTintPhoto }, index) => {
        return (
          <Card
            key={`${index}-${instanceId}`}
            instance={instanceId}
            index={index}
            title={title}
            label={label}
            image={image}
            detail={detail}
            colour={cardColour || getColourFromLabel(label, availableColours)}
            tint={shouldTintPhoto !== undefined ? shouldTintPhoto : defaultShouldTintPhoto}
            itemsPerRow={itemsPerRow}
            isOpen={index === openIndex}
            onToggle={() => onToggle(index)}
            onNavigate={ev => onNavigate(index, ev)}
          />
        );
      })}
    </dl>
  );
};
