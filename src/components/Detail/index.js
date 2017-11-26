const { h, Component } = require('preact');
const styles = require('./styles.scss');

const TABBABLE_SELECTOR = '[href], button, input:not([type="hidden"]), select, textarea, [tabindex]';

class Detail extends Component {
  constructor(props) {
    super(props);

    this.toggleTabbable = this.toggleTabbable.bind(this);
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
      this.base.appendChild(node);
    });

    this.tabbable = [...this.base.querySelectorAll(TABBABLE_SELECTOR)].map(el => ({
      el,
      initial: el.getAttribute('tabindex')
    }));

    this.toggleTabbable();
  }

  componentDidUpdate() {
    this.toggleTabbable();
  }

  render() {
    return <div className={`${styles.root} u-richtext`} data-component="Detail" />;
  }
}

module.exports = Detail;
