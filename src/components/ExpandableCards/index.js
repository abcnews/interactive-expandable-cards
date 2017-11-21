const classNames = require('classnames');
const { h, Component } = require('preact');
const { Collapse } = require('react-collapse');
const Control = require('../Control');
const Detail = require('../Detail');
const styles = require('./styles.scss');

const INITIAL_ITEMS_PER_ROW = 2;
const SPRING_CONFIG = { stiffness: 330, damping: 30 };

let nextId = 0;

class ExpandableCards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: nextId++,
      itemsPerRow: INITIAL_ITEMS_PER_ROW,
      openIndex: null,
      closingIndex: null
    };

    this.integrateWithOdyssey = this.integrateWithOdyssey.bind(this);
    this.integrateWithPhase1Mobile = this.integrateWithPhase1Mobile.bind(this);
    this.measureBase = this.measureBase.bind(this);
  }

  componentDidMount() {
    this.integrateWithOdyssey();
    this.integrateWithPhase1Mobile();
    this.measureBase();
    this.measurementInterval = setInterval(this.measureBase, 250);
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
    } else if (width >= 960) {
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
      this.base.parentElement.removeClass('u-richtext').addClass('u-pull');
    } else {
      window.addEventListener('odyssey:api', this.integrateWithOdyssey);
    }
  }

  integrateWithPhase1Mobile() {
    if (this.base.parentElement.className.indexOf('embed-wysiwyg') > -1) {
      this.base.parentElement.classList.add(styles.borderless);
    }
  }

  onToggle(index) {
    if (this.isIgnoringToggles) {
      return;
    }

    if (this.state.openIndex === index) {
      return this.setState({ openIndex: null });
    } else if (this.state.openIndex === null) {
      return this.setState({ openIndex: index });
    }

    this.isIgnoringToggles = true;
    this.setState({ openIndex: null });

    setTimeout(() => {
      this.isIgnoringToggles = false;
      this.setState({ openIndex: index });
    }, 250);
  }

  render({ items }, { id, itemsPerRow, openIndex, closingIndex }) {
    const atLeastOneItemHasLabel = items.some(x => x.label);

    return (
      <dl role="presentation" className={styles.root}>
        {items.reduce((memo, item, index) => {
          const controlId = `ExpandableCards_${id}__Control_${index}`;
          const regionId = `ExpandableCards_${id}__Region_${index}`;
          const order = 1 + index % itemsPerRow + Math.floor(index / itemsPerRow) * itemsPerRow * 2;

          return memo.concat([
            <dt key={controlId} role="heading" aria-level="3" className={styles[`of${itemsPerRow}`]} style={{ order }}>
              <Control
                id={controlId}
                label={item.label}
                image={item.image}
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
              style={{ order: order + itemsPerRow }}
            >
              <Collapse
                isOpened={index === openIndex}
                springConfig={SPRING_CONFIG}
                theme={{ collapse: styles.collapse, content: styles.content }}
              >
                <Detail nodes={item.detail} />
              </Collapse>
            </dd>
          ]);
        }, [])}
      </dl>
    );
  }
}

module.exports = ExpandableCards;
