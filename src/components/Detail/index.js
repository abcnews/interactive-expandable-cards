const classNames = require('classnames');
const { h, Component } = require('preact');
const styles = require('./styles.scss');

const TABBABLE_SELECTOR = '[href], button, input:not([type="hidden"]), select, textarea, [tabindex]';

class Detail extends Component {
  constructor(props) {
    super(props);

    this.toggleTabbable = this.toggleTabbable.bind(this);
    this.getContentRef = this.getContentRef.bind(this);
  }

  getContentRef(el) {
    this.content = el;
  }

  animateHeightChange() {
    this.base.style.height = `${this.content.clientHeight}px`;
    setTimeout(() => {
      this.base.style.height = this.props.open ? 'auto' : '0';
    }, this.props.open ? 250 : 0);
  }

  toggleTabbable() {
    this.tabbable.forEach(x => {
      if (this.props.open) {
        if (x.initial === null) {
          x.el.removeAttribute('tabindex');
        } else {
          x.el.setAttribute('tabindex', x.initial);
        }
      } else {
        x.el.setAttribute('tabindex', -1);
      }
    });
  }

  componentDidMount() {
    this.props.nodes.forEach(node => {
      this.content.appendChild(node);
    });

    this.tabbable = [...this.content.querySelectorAll(TABBABLE_SELECTOR)].map(el => ({
      el,
      initial: el.getAttribute('tabindex')
    }));

    this.animateHeightChange();
    this.toggleTabbable();
  }

  componentDidUpdate() {
    this.animateHeightChange();
    this.toggleTabbable();
  }

  render() {
    return (
      <div className={classNames(styles.root, { [styles.open]: this.props.open })} data-component="Detail">
        <div ref={this.getContentRef} className={`${styles.content} u-richtext`} />
      </div>
    );
  }
}

module.exports = Detail;
