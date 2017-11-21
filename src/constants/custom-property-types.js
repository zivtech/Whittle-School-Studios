import PropTypes from 'prop-types';

import { IMAGE_BP, IMAGE_SHAPE, IMAGE_TYPE } from './images';
import { PAGE_TYPES } from './settings';
import { BREAKPOINT } from './breakpoints';
import { LANGUAGE, REGION, REGION_LANGUAGES } from './regions';

const isValidSourcesBySize = sourcesBySize =>
  Object.keys(sourcesBySize).every((breakpoint) => {
    const { src, srcSet } = sourcesBySize[breakpoint];
    return (
      Object.values(IMAGE_BP).includes(breakpoint) &&
      typeof src === 'string' &&
      srcSet.every(item => /.* \d\.?\d?x/.test(item))
    );
  });

const validateSourcesBySize = (props, propName) => {
  const sourcesBySize = props[propName];
  return isValidSourcesBySize(sourcesBySize) ? undefined : new Error('invalid sources by size');
};

const validateImageDataByType = (props, propName) => {
  const imageDataByType = props[propName];
  const isValid = Object.keys(imageDataByType).every((imageType) => {
    const imageData = imageDataByType[imageType];
    return Object.values(IMAGE_TYPE).includes(imageType) &&
      Array.isArray(imageData) ?
      imageData.every(sources => !sources || isValidSourcesBySize(sources)) :
      isValidSourcesBySize(imageData);
  });
  return isValid ? undefined : new Error('invalid image data by type');
};

const BODY_TEXT = PropTypes.shape({
  __typename: PropTypes.string.isRequired,
  content: PropTypes.shape({
    markdown: PropTypes.string.isRequired,
  }).isRequired,
});

const INLINE_IMAGE = PropTypes.shape({
  __typename: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  caption: PropTypes.string,
  shape: PropTypes.oneOf([IMAGE_SHAPE.SQUARE, IMAGE_SHAPE.RECTANGLE]).isRequired,
});

const validateGlobalSettings = (props, propName) => {
  const globalSettings = props[propName];
  const isValid = Object.keys(globalSettings).every(language =>
    REGION_LANGUAGES[process.env.GATSBY_REGION].includes(language) && typeof globalSettings[language] === 'object');
  return isValid ? undefined : new Error('invalid global settings');
};

exports.PROP_TYPES = {
  BREAKPOINT: PropTypes.oneOf(BREAKPOINT),
  GLOBAL_SETTINGS: PropTypes.shape(validateGlobalSettings),
  IMAGE_DATA_BY_TYPE: PropTypes.shape(validateImageDataByType),
  IMAGE_SOURCES: PropTypes.shape(validateSourcesBySize),
  LANGUAGE: PropTypes.oneOf([LANGUAGE.ENGLISH, LANGUAGE.CHINESE]),
  MODULES: PropTypes.arrayOf(PropTypes.oneOfType([BODY_TEXT, INLINE_IMAGE])),
  PAGE_TYPES: PropTypes.oneOf(PAGE_TYPES),
  REGION: PropTypes.oneOf([REGION.US, REGION.CHINA]),
};