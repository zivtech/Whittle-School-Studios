import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Arrow from '../../global/arrow';
import Link from '../../global/link';

import styles from './recirculation.module.css';

import { PROP_SHAPES } from '../../../constants/custom-property-types';
import { NAV_DIRECTIONS } from '../../../constants/settings';
import { CLASSES } from '../../../constants/classes';

import { getArticleTitle } from '../../../utils/nav';

const propTypes = {
  items: PROP_SHAPES.NAV_ITEM_LIST.isRequired,
  setLastElementBottom: PropTypes.func,
};

class Recirculation extends Component {
  constructor(props) {
    super(props);

    this.state = this.getItems(props);
  }

  componentDidMount() {
    if (this.props.setLastElementBottom) {
      setTimeout(() => {
        this.props.setLastElementBottom(document.body.clientHeight - this.componentWrapper.offsetTop);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getItems(nextProps));
  }

  getItemNumber = item => `${this.props.items.indexOf(item) + 1}`;

  getActiveIndex = (items) => {
    let activeIndex = 0;
    items.forEach((item, index) => {
      if (item.isActive) {
        activeIndex = index;
      }
    });

    return activeIndex;
  };

  getItems = (props) => {
    const activeIndex = this.getActiveIndex(props.items);
    let previousItem = false;
    let nextItem = false;

    // Check previous item
    if (activeIndex > 0) {
      previousItem = props.items[activeIndex - 1];
    }

    // Check next item
    if (activeIndex < props.items.length - 1) {
      nextItem = props.items[activeIndex + 1];
    }

    return {
      nextItem,
      previousItem,
    };
  };

  getNavigationItem = (item, type) => {
    const { translation } = this.context;

    return (
      <div className={cx(styles.navigationItemWrapper, CLASSES.RECIRCULATION, {
        [styles.navigationItemWrapper_isBig]: type === NAV_DIRECTIONS.NEXT ||
        (type === NAV_DIRECTIONS.PREVIOUS && !this.isFullSize()),
        [styles.navigationItemWrapper_isSingle]: !this.isFullSize(),
      })}
      >
        <Link
          className={styles.navigationItem}
          to={`/${item.link}`}
        >
          <span
            aria-label={`${type === NAV_DIRECTIONS.NEXT ?
              translation && translation('recirculation.next') : translation && translation('recirculation.previous')}
              ${this.getItemNumber(item)} ${item.title}`}
            className={styles.direction}
          >
            {type === NAV_DIRECTIONS.PREVIOUS && (
              <span
                aria-hidden="true"
                className={styles.directionLabel}
              >
                <Arrow isLeft />
                {translation && translation('recirculation.previous')}
              </span>
            )}
            {type === NAV_DIRECTIONS.NEXT && (
              <span
                aria-hidden="true"
                className={styles.directionLabel}
              >
                {translation && translation('recirculation.next')}
                <Arrow />
              </span>
            )}
            <span className={styles.titleWrapper}>
              <span
                aria-hidden="true"
                className={styles.number}
              >
                {`0${this.getItemNumber(item)}`}
              </span>
              <span
                aria-hidden="true"
                className={styles.title}
              >
                <span className={styles.titleInner}>
                  {getArticleTitle(item.title, this.getItemNumber(item) - 1, translation)}
                </span>
              </span>
            </span>
          </span>
          <span className={styles.description}>
            {item.description}
          </span>
        </Link>
      </div>
    );
  };

  // Check if we have 2 items to show
  isFullSize = () => this.state.previousItem && this.state.nextItem;

  render() {
    return (
      <div
        className={styles.wrapper}
        ref={(el) => { this.componentWrapper = el; }}
      >
        <div className={styles.container}>
          <nav className={styles.navigation}>
            {this.state.previousItem &&
              this.getNavigationItem(
                this.state.previousItem,
                NAV_DIRECTIONS.PREVIOUS
              )}
            {this.state.nextItem &&
              this.getNavigationItem(
                this.state.nextItem,
                NAV_DIRECTIONS.NEXT
              )}
          </nav>
        </div>
      </div>
    );
  }
}

Recirculation.propTypes = propTypes;
Recirculation.contextTypes = { translation: PropTypes.func.isRequired };

export default Recirculation;
