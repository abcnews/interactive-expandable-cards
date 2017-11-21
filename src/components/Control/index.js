const classNames = require('classnames/bind');
const { h, Component } = require('preact');
const styles = require('./styles.scss');

const SCROLL_INTO_VIEW_OPTIONS = { behavior: 'smooth', block: 'center', inline: 'end' };
const TITLE_SCROLL_MARGIN = 48;

class Control extends Component {
  constructor(props) {
    super(props);

    this.getToggleElRef = this.getToggleElRef.bind(this);
  }

  getToggleElRef(el) {
    this.toggleEl = el;
  }

  componentDidUpdate({ open: wasAlreadyOpen }) {
    if (this.props.open && !wasAlreadyOpen) {
      const { top, bottom } = this.toggleEl.getBoundingClientRect();

      if (top < TITLE_SCROLL_MARGIN || bottom > window.innerHeight - TITLE_SCROLL_MARGIN) {
        this.toggleEl.scrollIntoView(SCROLL_INTO_VIEW_OPTIONS);
      }
    }
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
        data-component="Control"
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
        <div ref={this.getToggleElRef} class={styles.toggle} role="presentation" />
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
