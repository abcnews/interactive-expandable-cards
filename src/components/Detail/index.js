const { h, Component } = require('preact');
const styles = require('./styles.scss');

class Detail extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.nodes.forEach(node => {
      this.base.appendChild(node);
    });
  }

  render() {
    return <div className={`${styles.root} u-richtext`} />;
  }
}

module.exports = Detail;
