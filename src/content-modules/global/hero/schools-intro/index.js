import React from 'react';
import cx from 'classnames';

import Link from '../../../../components/global/link';
import OpeningCountdown from '../opening-countdown';
import Picture from '../../../../components/global/picture';
import { parseLink } from '../../../../utils/nav';

import { PROP_TYPES } from '../../../../constants/custom-property-types';

import styles from './intro.module.css';

const propTypes = PROP_TYPES.SCHOOLS_INTRO.isRequired;

const SchoolsIntro = ({
  description,
  imageAlt,
  image,
  link,
  title,
  countdownTitle,
  countdownDate,
  hasLine,
  downloadBook,
  downloadBookImage,
}) => (
  <div className={styles.wrapper}>
    <div className={styles.introWrapper}>
      <Picture
        alt={imageAlt}
        className={styles.image}
        sourcesBySize={image}
      />
      <div className={styles.content}>
        <div className={styles.contentWrapper}>
          <div className={cx(styles.contentInner, {
            [styles.contentInner_hasLine]: hasLine,
          })}
          >
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description.markdown}</p>
            {link && (link.linkDestinationInternal || link.linkDestinationExternal) && (
              <Link
                className={styles.link}
                to={parseLink({ external: link.linkDestinationExternal, internal: link.linkDestinationInternal })}
              >
                {link.linkTitle}
              </Link>
            )}
          </div>
        </div>
        <div className={cx(styles.countdownWrapper, 'showMd')}>
          <OpeningCountdown
            date={countdownDate}
            title={countdownTitle}
          />
        </div>
      </div>
    </div>
    <div className={cx(styles.countdownWrapper, 'hideMd')}>
      <OpeningCountdown
        date={countdownDate}
        title={countdownTitle}
      />
      {downloadBook && (
        <div className={cx(styles.downloadBook)}>
          <h3>{downloadBook.title}</h3>
          <a
            href={downloadBook.url}
            target="_blank"
          >
            <Picture
              alt={downloadBook.title}
              sourcesBySize={downloadBookImage}
            />
          </a>
        </div>
      )}
    </div>

  </div>
);

SchoolsIntro.propTypes = propTypes;

export default SchoolsIntro;
