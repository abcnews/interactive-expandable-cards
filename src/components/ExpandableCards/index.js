const classNames = require('classnames');
const { h, Component } = require('preact');
const Control = require('../Control');
const Detail = require('../Detail');
const styles = require('./styles.scss');

const INITIAL_ITEMS_PER_ROW = 2;

let nextId = 0;

class ExpandableCards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: nextId++,
      itemsPerRow: INITIAL_ITEMS_PER_ROW,
      openIndex: null,
      opened: [],
      logged: false
    };

    this.integrateWithOdyssey = this.integrateWithOdyssey.bind(this);
    this.integrateWithPhase1Mobile = this.integrateWithPhase1Mobile.bind(this);
    this.measureBase = this.measureBase.bind(this);
    this.sendLog = this.sendLog.bind(this);
  }

  sendLog() {
    if (this.state.logged || typeof navigator.sendBeacon === 'undefined') {
      return;
    }
    this.setState({logged: true});
    var now = new Date();
    var openedUnique = new Set(this.state.opened);
    var requestedAtTimestamp = new Date(window.performance.timing.navigationStart).toISOString();
    var firestoreURL = `https://firestore.googleapis.com/v1beta1/projects/interactive-expandable-cards/databases/(default)/documents/view/?documentId=${requestedAtTimestamp}_${Math.random()}`;
    var firestoreData = {
      fields: {
        cmid: { integerValue: parseInt(document.URL.match(/\d{5,}/)[0], 10) },
        url: { stringValue: document.URL },
        requestedAt: { timestampValue: requestedAtTimestamp },
        timeToLoad: { doubleValue: (window.performance.timing.domComplete - window.performance.timing.navigationStart) / 1000 },
        timeOnPage: { doubleValue: (now.getTime() - window.performance.timing.domComplete) / 1000 },
        itemsTotal: { integerValue: this.props.items.length },
        itemsPerRow: { integerValue: this.state.itemsPerRow },
        itemsOpened: { integerValue: this.state.opened.length },
        itemsOpenedUnique: { integerValue: openedUnique.size },
        itemsOpenedPct: { doubleValue: openedUnique.size / this.props.items.length * 100 },
        itemsOpenedArray: {
          arrayValue: {
            values: this.state.opened.map( x => ({ integerValue: x }) )
          }
        },
        itemsOpenedArrayUnique: {
          arrayValue: {
            values: [...openedUnique].map( x => ({ integerValue: x }) )
          }
        }
      }
    };
    navigator.sendBeacon(firestoreURL, JSON.stringify(firestoreData));
  }

  componentDidMount() {
    this.integrateWithOdyssey();
    this.integrateWithPhase1Mobile();
    this.measureBase();
    this.measurementInterval = setInterval(this.measureBase, 250);
    window.addEventListener('beforeunload', this.sendLog);
    window.addEventListener('unload', this.sendLog);
  }

  componentWillUnmount() {
    clearInterval(this.measurementInterval);
  }

  measureBase() {
    const width = this.base.offsetWidth;
    let itemsPerRow;

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

  integrateWithOdyssey() {
    if (window.__ODYSSEY__) {
      this.base.parentElement.classList.remove('u-richtext');
      this.base.parentElement.classList.add('u-pull');
    } else {
      window.addEventListener('odyssey:api', this.integrateWithOdyssey);
    }
  }

  integrateWithPhase1Mobile() {
    if (this.base.parentElement.className.indexOf('embed-wysiwyg') > -1) {
      this.base.parentElement.classList.add(styles.borderless);
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
      [...this.base.querySelectorAll('[data-component="Control"]')].forEach((el, index) => {
        if (index === nextIndex) {
          el.focus();
        }
      });
    }
  }

  onToggle(index) {
    if (this.isIgnoringToggles) {
      return;
    }

    if (this.state.openIndex === index) {
      return this.setState({ openIndex: null });
    } else if (this.state.openIndex === null) {
      return this.setState({ openIndex: index, opened: this.state.opened.concat([index]) });
    }

    this.isIgnoringToggles = true;
    this.setState({ openIndex: null });

    setTimeout(() => {
      this.isIgnoringToggles = false;
      this.setState({ openIndex: index, opened: this.state.opened.concat([index]) });
    }, 250);
  }

  render({ items }, { id, itemsPerRow, openIndex }) {
    const atLeastOneItemHasLabel = items.some(x => x.label);

    return (
      <dl role="presentation" className={styles.root} data-component="ExpandableCards">
        {items.reduce((memo, item, index) => {
          const controlId = `ExpandableCards_${id}__Control_${index}`;
          const regionId = `ExpandableCards_${id}__Region_${index}`;
          const order = 1 + index % itemsPerRow + Math.floor(index / itemsPerRow) * itemsPerRow * 2;

          return memo.concat([
            <dt
              key={controlId}
              role="heading"
              aria-level="3"
              className={styles[`of${itemsPerRow}`]}
              style={`order:${order};-webkit-order:${order}`}
            >
              <Control
                id={controlId}
                label={item.label}
                image={item.image}
                onNavigate={this.onNavigate.bind(this, index)}
                onToggle={this.onToggle.bind(this, index)}
                open={index === openIndex}
                regionId={regionId}
                siblingsHaveLabels={atLeastOneItemHasLabel}
                title={item.title}
              />
            </dt>,
            <dd
              key={regionId}
              id={regionId}
              role="region"
              aria-hidden={index === openIndex ? 'false' : 'true'}
              aria-labelledby={controlId}
              style={`order:${order + itemsPerRow};-webkit-order:${order + itemsPerRow}`}
            >
              <Detail nodes={item.detail} open={index === openIndex} />
            </dd>
          ]);
        }, [])}
      </dl>
    );
  }
}

module.exports = ExpandableCards;
