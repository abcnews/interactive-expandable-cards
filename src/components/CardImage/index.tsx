import { h, FunctionalComponent } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import styles from './styles.scss';
import GammaFilter from '../GammaFilter';
import { RGB, rgbGamma } from '../../lib/utils';
import { ExpandableCardsImage } from '../ExpandableCards';

let idCounter = 0;

type CardImageProps = {
  image: ExpandableCardsImage;
  tint: false | RGB;
};

const CardImage: FunctionalComponent<CardImageProps> = ({ image, tint }) => {
  const [srcSet, setSrcSet] = useState<string[]>([]);
  const id = useMemo<string>(() => '' + idCounter++, []);

  const filterId = `ExpandableCards__Filter_${id}`;
  const filterCSS = tint ? `grayscale(100%) url(#${filterId})` : undefined;

  useEffect(() => {
    setSrcSet(image.renditions.map(i => `${i.url} ${i.width}w`));
  }, [image]);

  return (
    <figure className={styles.image} role="presentation">
      <img
        alt={image.alt}
        src={image.url}
        srcset={srcSet.join(', ')}
        sizes="(min-width: 1200px) 180px, (max-width: 1200px; min-width: 992px) 145px, 210px"
        style={{ filter: filterCSS, '-webkit-filter': filterCSS }}
      />

      {tint && <GammaFilter id={filterId} exponents={rgbGamma(tint)} />}
    </figure>
  );
};

export default CardImage;
