import { h, Component, createRef } from 'preact';
import {Control} from '../Control';
import {Detail} from '../Detail';
import styles from './styles.scss';

type ExpandableCardsProps = {
  items: ExpandableCardsItem[],
  config: ExpandableCardsItemConfig
}

type ExpandableCardsState = {
  itemsPerRow: number,
  id: number,
  openIndex: number | null,
  toggling: boolean
}

export type ExpandableCardsItem = {
  label:string,
      image:string,
      title:string,
      detail: HTMLElement[],
      config: ExpandableCardsItemConfig
}

export type ExpandableCardsItemConfig = {

}

const INITIAL_ITEMS_PER_ROW = 2;
const MAX_ALLOWED_CATEGORIES = 6;

let nextId = 0;

export class ExpandableCards extends Component<ExpandableCardsProps, ExpandableCardsState> {

  baseRef = createRef();
  itemsOpened:ExpandableCardsItem[] = [];
  logged: boolean;
  measurementIntervalId: number | undefined;

  constructor(props:ExpandableCardsProps) {
    super(props);

    this.state = {
      id: nextId++,
      itemsPerRow: INITIAL_ITEMS_PER_ROW,
      openIndex: null,
      toggling: false
    };

    this.itemsOpened = [];
    this.logged = false;

    this.measureBase = this.measureBase.bind(this);
    this.sendLog = this.sendLog.bind(this);
  }

  sendLog() {
    if (this.logged || typeof navigator.sendBeacon === 'undefined') {
      return;
    }
    this.logged = true;
    var now = new Date();
    var idMatches = document.URL.match(/\d{5,}/);
    var openedUnique = new Set(this.itemsOpened);
    var firestoreURL = `https://firestore.googleapis.com/v1beta1/projects/interactive-expandable-cards/databases/(default)/documents/view/`;
    var firestoreData = {
      fields: {
        cmid: { integerValue: idMatches ? parseInt(idMatches[0], 10) : 0 },
        url: { stringValue: document.URL },
        requestedAt: { timestampValue: new Date(window.performance.timing.navigationStart).toISOString() },
        timeToLoad: {
          doubleValue: (window.performance.timing.domComplete - window.performance.timing.navigationStart) / 1000
        },
        timeOnPage: { doubleValue: (now.getTime() - window.performance.timing.domComplete) / 1000 },
        itemsTotal: { integerValue: this.props.items.length },
        itemsPerRow: { integerValue: this.state.itemsPerRow },
        itemsOpened: { integerValue: this.itemsOpened.length },
        itemsOpenedUnique: { integerValue: openedUnique.size },
        itemsOpenedPct: { doubleValue: (openedUnique.size / this.props.items.length) * 100 },
        itemsOpenedArray: {
          arrayValue: {
            values: this.itemsOpened.map(x => ({ integerValue: x }))
          }
        },
        itemsOpenedArrayUnique: {
          arrayValue: {
            values: [...openedUnique].map(x => ({ integerValue: x }))
          }
        }
      }
    };
    navigator.sendBeacon(firestoreURL, JSON.stringify(firestoreData));
  }

  componentDidMount() {
    // Integrate with Odyssey
    const integrateWithOdyssey = () => {
      this.baseRef.current.parentElement.classList.remove('u-richtext');
      this.baseRef.current.parentElement.classList.add('u-pull');
    }
    if (window.__ODYSSEY__) {
      integrateWithOdyssey();
    } else {
      window.addEventListener('odyssey:api', integrateWithOdyssey);
    }

    // Integrate with phase 1 mobile
    if (this.baseRef.current.parentElement.className.indexOf('embed-wysiwyg') > -1) {
      this.baseRef.current.parentElement.classList.add(styles.borderless);
    }

    this.measureBase();
    this.measurementIntervalId = window.setInterval(this.measureBase, 250);
    window.addEventListener('beforeunload', this.sendLog);
    window.addEventListener('unload', this.sendLog);
  }

  componentWillUnmount() {
    clearInterval(this.measurementIntervalId);
    window.removeEventListener('beforeunload', this.sendLog);
    window.removeEventListener('unload', this.sendLog);
    this.sendLog();
  }

  // TODO: this should be observed in a way that doesn't involve intervals.
  measureBase() {

    const width = this.baseRef.current.offsetWidth;
    let itemsPerRow: number;

    if (width >= 1480) {
      itemsPerRow = 6;
    } else if (width >= 1200) {
      itemsPerRow = 5;
    } else if (width >= 940) {
      itemsPerRow = 4;
    } else if (width >= 480) {
      itemsPerRow = 3;
    } else if (width >= 240) {
      itemsPerRow = 2;
    } else {
      itemsPerRow = 1;
    }

    if (itemsPerRow !== this.state.itemsPerRow) {
      this.setState({ itemsPerRow });
    }

  }



  onNavigate(index, event) {
    let nextIndex = index;

    switch (event.keyCode) {
      case 37:
        nextIndex--;
        break;
      case 38:
        nextIndex -= this.state.itemsPerRow;
        break;
      case 39:
        nextIndex++;
        break;
      case 40:
        nextIndex += this.state.itemsPerRow;
        break;
      default:
        nextIndex = -1;
        break;
    }

    if (nextIndex > -1 && nextIndex < this.props.items.length) {
      event.preventDefault();
      [...this.baseRef.current.querySelectorAll('[data-component="Control"]')].forEach((el, index) => {
        if (index === nextIndex) {
          el.focus();
        }
      });
    }
  }

  onToggle(index) {
    // Don't toggle while toggling.
    if (this.state.toggling) return;

    if (this.state.openIndex === index) {
      return this.setState({ openIndex: null });
    } else if (this.state.openIndex === null) {
      this.itemsOpened.push(index);
      return this.setState({ openIndex: index });
    }

    this.setState({toggling: true, openIndex: null});

    setTimeout(() => {
      this.itemsOpened.push(index);
      this.setState({ openIndex: index, toggling: false });
    }, 250);
  }

  render({ items }:ExpandableCardsProps, { id, itemsPerRow, openIndex }:ExpandableCardsState) {
    const categories = items.reduce<string[]>((memo, item) => {
      if (item.label && memo.indexOf(item.label) < 0) {
        memo.push(item.label);
      }
      return memo;
    }, []);

    return (
      <dl ref={this.baseRef} role="presentation" className={styles.root} data-component="ExpandableCards">
        {items.reduce<HTMLDListElement[]>((memo, item, index) => {
          const controlId = `ExpandableCards_${id}__Control_${index}`;
          const regionId = `ExpandableCards_${id}__Region_${index}`;
          const filterId = `ExpandableCards_${id}__Filter_${index}`;
          const order = 1 + (index % itemsPerRow) + Math.floor(index / itemsPerRow) * itemsPerRow * 2;

          return memo.concat([
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
                onNavigate={this.onNavigate.bind(this, index)}
                onToggle={this.onToggle.bind(this, index)}
                open={index === openIndex}
                regionId={regionId}
                siblingsHaveLabels={categories.length > 0}
                title={item.title}
                filterId={filterId}
                config={{ ...this.props.config, ...item.config }}
              />
            </dt>,
            <dd
              key={regionId}
              id={regionId}
              role="region"
              aria-hidden={index === openIndex ? 'false' : 'true'}
              aria-labelledby={controlId}
              style={{ 'order': order+itemsPerRow, '-webkit-order': order+itemsPerRow }}
            >
              <Detail nodes={item.detail} open={index === openIndex} />
            </dd>
          ]);
        }, [])}
      </dl>
    );
  }
}
