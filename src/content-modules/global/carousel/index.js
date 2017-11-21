import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

import styles from './carousel.module.css';

import { getInlineImagePropTypes, PROP_TYPES } from '../../../constants/custom-property-types';

const propTypes = {
  imageSources: PropTypes.arrayOf(PROP_TYPES.IMAGE_SOURCES.isRequired).isRequired,
  slides: PropTypes.arrayOf(PropTypes.shape(getInlineImagePropTypes(true))).isRequired,
};

const {
  CLASSES,
} = require('./../../../constants/classes');

const {
  TIMINGS,
} = require('./../../../constants/timings');

const CAROUSEL_DIRECTION = {
  RIGHT: 1,
  LEFT: -1,
};

class Carousel extends Component {
  state = {
    currentSlide: 0,
    currentCaption: this.props.slides[0].caption,
    fading: false,
  };

  componentWillMount() {
    const { imageSources, slides } = this.props;

    this.formattedItems = imageSources.map((itemImageSources, i) => {
      const { alt, shape } = slides[i];
      const breakpoints = Object.keys(itemImageSources);

      // TODO Find a way to add a `media` property to Carousel images
      // so we can include srcSets for all breakpoints
      const largestBreakpoint = breakpoints[breakpoints.length - 1];
      const data = itemImageSources[largestBreakpoint];

      return {
        original: data.src,
        originalAlt: alt,
        originalClass: `_is${shape}`,
        srcSet: data.srcSet,
      };
    });
  }

  componentDidMount = () => {
    this.handleARIA();
  }

  componentDidUpdate = () => {
    this.handleARIA();
  }

  onClickModalClose = () => {
    this.gallery.exitFullScreen();
  }

  onClickLeft = () => {
    this.changeSlide(CAROUSEL_DIRECTION.LEFT);
  }

  onClickRight = () => {
    this.changeSlide(CAROUSEL_DIRECTION.RIGHT);
  }

  onClickImage = (e) => {
    const imageClassList = e.target.parentNode.parentNode.classList;
    if (imageClassList.contains(CLASSES.GALLERY_IMAGE_CENTER)) {
      // Full screen mode is temporarily disabled.
      // this.gallery.fullScreen();
    } else if (imageClassList.contains(CLASSES.GALLERY_IMAGE_RIGHT)) {
      this.onClickRight();
    } else if (imageClassList.contains(CLASSES.GALLERY_IMAGE_LEFT)) {
      this.onClickLeft();
    }
  }

  onFullScreenClick = () => {
    this.gallery.fullScreen();
  }

  onSlide = (e) => {
    this.setState({
      fading: true,
    });
    setTimeout(() => {
      this.setState({
        currentCaption: this.props.slides[e].caption,
        fading: false,
      });
    }, TIMINGS.CAROUSEL_CAPTION_CHANGE_TIME);
  }

  changeSlide = (direction) => {
    this.setState({
      currentSlide: this.gallery.getCurrentIndex() + direction,
    });
    this.gallery.slideToIndex(this.gallery.getCurrentIndex() + direction);
  }

  handleARIA = () => {
    let allGalleryItems;
    let currentItem;
    if (typeof window !== 'undefined') {
      allGalleryItems = document.querySelectorAll(`.${CLASSES.GALLERY_IMAGE} img`);
      // We use querySelectorAll here in case we have more than one carousel on page
      currentItem = document.querySelectorAll(`.${CLASSES.GALLERY_IMAGE_CENTER} .${CLASSES.GALLERY_IMAGE} img`);
      allGalleryItems.forEach((e) => { e.setAttribute('aria-hidden', 'true'); });
      currentItem.forEach((e) => { e.setAttribute('aria-hidden', 'false'); });
    }
  }

  renderLeftNav = () => {
    const { translations } = this.context;
    return (
      <button
        aria-label={translations.carousel.prevAriaLabel}
        className={cx('image-gallery-custom-left-nav', styles.arrow, styles.arrowLeft)}
        disabled={this.state.currentSlide === 0}
        onClick={this.onClickLeft}
      />
    );
  }

  renderRightNav = () => {
    const { translations } = this.context;

    return (
      <button
        aria-label={translations.carousel.nextAriaLabel}
        className={cx('image-gallery-custom-right-nav', styles.arrow, styles.arrowRight)}
        disabled={this.state.currentSlide === this.props.slides.length - 1}
        onClick={this.onClickRight}
      />
    );
  }

  renderFullscreenButton = () => {
    const { translations } = this.context;

    return (
      <button
        aria-label={translations.carousel.fullScreenAriaLabel}
        className={styles.fullScreenButton}
        onClick={this.onFullScreenClick}
      />
    );
  }

  render() {
    return (
      <div className={styles.componentWrapper}>
        <div className={styles.componentContent}>
          <ImageGallery
            infinite={false}
            items={this.formattedItems}
            onClick={this.onClickImage}
            onSlide={this.onSlide}
            ref={(el) => { this.gallery = el; }}
            showFullscreenButton={false}
            showNav={false}
            showPlayButton={false}
            showThumbnails={false}
            useBrowserFullscreen={false}
          />
          <button
            className={styles.closeButton}
            onClick={this.onClickModalClose}
          >
            Close
          </button>
          <div className={styles.carouselInfo}>
            <div className={cx(
                styles.caption,
                { [styles.caption_isFading]: this.state.fading },
              )}
            >
              {this.state.currentCaption}
            </div>
            {this.renderLeftNav()}
            {this.renderRightNav()}
            {/* Full screen mode is temporarily disabled. */}
            {/* {this.renderFullscreenButton()} */}
          </div>
        </div>
      </div>
    );
  }
}

Carousel.contextTypes = { translations: PropTypes.object };
Carousel.propTypes = propTypes;

export default Carousel;
