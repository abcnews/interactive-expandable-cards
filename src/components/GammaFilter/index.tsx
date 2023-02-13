import { h, FunctionalComponent } from 'preact';
import styles from './styles.scss';

type GammaFilterProps = {
  id: string;
  exponents: { r: number; g: number; b: number };
};

const GammaFilter: FunctionalComponent<GammaFilterProps> = ({ id, exponents: { r, g, b } }) => {
  return (
    <svg className={styles.filter}>
      <defs></defs>
      <filter id={id} color-interpolation-filters="sRGB" x="0" y="0" height="100%" width="100%">
        <feComponentTransfer>
          <feFuncR type="gamma" exponent={r} />
          <feFuncG type="gamma" exponent={g} />
          <feFuncB type="gamma" exponent={b} />
        </feComponentTransfer>
      </filter>
    </svg>
  );
};

export default GammaFilter;
