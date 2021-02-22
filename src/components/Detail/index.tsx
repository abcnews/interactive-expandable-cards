import classNames from 'classnames';
import { h, Component, createRef } from 'preact';
import styles from './styles.scss';

type DetailProps = {
  open: boolean;
  nodes: HTMLElement[];
};

const TABBABLE_SELECTOR = '[href], button, input:not([type="hidden"]), select, textarea, [tabindex]';

export class Detail extends Component<DetailProps> {
  contentRef = createRef();
  tabbable: { el: HTMLElement; initial: string }[] = [];

  constructor(props: DetailProps) {
    super(props);

    this.toggleTabbable = this.toggleTabbable.bind(this);
  }

  animateHeightChange() {
    if (this.base instanceof HTMLElement) {
      const el = this.base;
      el.style.height = `${this.contentRef.current.clientHeight}px`;
      setTimeout(
        () => {
          el.style.height = this.props.open ? 'auto' : '0';
        },
        this.props.open ? 250 : 0
      );
    }
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
        x.el.setAttribute('tabindex', '-1');
      }
    });
  }

  componentDidMount() {
    this.props.nodes.forEach(node => {
      this.contentRef.current.appendChild(node);
    });

    this.tabbable = [...this.contentRef.current.querySelectorAll(TABBABLE_SELECTOR)].map(el => ({
      el,
      initial: el.getAttribute('tabindex')
    }));

    this.animateHeightChange();
    this.toggleTabbable();
  }

  componentDidUpdate({ open: wasPreviouslyOpen }) {
    if (wasPreviouslyOpen === this.props.open) {
      return;
    }

    this.animateHeightChange();
    this.toggleTabbable();
  }

  render() {
    return (
      <div className={classNames(styles.root, { [styles.open]: this.props.open })} data-component="Detail">
        <div ref={this.contentRef} className={`${styles.content} u-richtext`} />
      </div>
    );
  }
}
