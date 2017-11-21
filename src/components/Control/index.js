const classNames = require('classnames/bind');
const { h, Component } = require('preact');
const styles = require('./styles.scss');

class Control extends Component {
  constructor(props) {
    super(props);
  }

  render({ id, image, label, onToggle, open, order, regionId, siblingsHaveLabels, title }) {
    return (
      <button
        ref={this.getRootRef}
        id={id}
        aria-controls={regionId}
        className={classNames(styles.root, { [styles.open]: open, [styles.siblingsHaveLabels]: siblingsHaveLabels })}
        onClick={onToggle}
        style={{ order }}
      >
        {label ? (
          <div
            className={classNames(styles.label, { [styles.long]: label.length > 12 })}
            data-expandable-cards-label={slug(label)}
          >
            {label}
          </div>
        ) : null}
        {image ? (
          <div className={styles.image} role="presentation">
            <img src={image} />
          </div>
        ) : null}
        <div class={styles.title}>{title}</div>
        <div class={styles.toggle} role="presentation" />
      </button>
    );
  }
}

const slug = string => {
  return string
    .replace(/\s/g, '-')
    .replace(/[()=:.,!#$@"'/\|?*+&]/g, '')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .toLowerCase();
};

module.exports = Control;
