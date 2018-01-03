import PropTypes from 'prop-types';

import { IMAGE_SIZE, IMAGE_SHAPE, IMAGE_TYPE } from './images';
import { CONTENT_MODULE } from './contentful';
import { PAGE_TYPES } from './settings';
import { BREAKPOINTS_NAME } from './breakpoints';
import { SOCIAL_NETWORK } from './social-networks';
import {
  LANGUAGE,
  LANGUAGE_CONTENTFUL_LOCALE,
  REGION_LANGUAGES,
} from './regions';

const isValidSourcesBySize = ({ id, ...sourcesBySize }) =>
  Object.keys(sourcesBySize).every((breakpoint) => {
    const { src, srcSet } = sourcesBySize[breakpoint];
    return (
      Object.values(IMAGE_SIZE).includes(breakpoint) &&
      typeof src === 'string' &&
      srcSet.every(item => /.* \d\.?\d?x/.test(item))
    );
  });

const validateSourcesBySize = (props, propName) => {
  const sourcesBySize = props[propName];
  return isValidSourcesBySize(sourcesBySize) ? undefined : new Error('invalid sources by size');
};

const IMAGE_SOURCES = PropTypes.shape(validateSourcesBySize);

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

const getInlineImagePropTypes = (withCircle = false) => ({
  alt: PropTypes.string.isRequired,
  caption: PropTypes.string,
  shape: PropTypes.oneOf(withCircle ?
    [IMAGE_SHAPE.CIRCLE, IMAGE_SHAPE.SQUARE, IMAGE_SHAPE.RECTANGLE] :
    [IMAGE_SHAPE.SQUARE, IMAGE_SHAPE.RECTANGLE]),
});

exports.getInlineImagePropTypes = getInlineImagePropTypes;

const MARKDOWN = PropTypes.shape({
  markdown: PropTypes.string.isRequired,
});

const VIDEO_EMBED_CODE = PropTypes.shape({
  embedCode: PropTypes.string.isRequired,
});

const createTypenameChecker = desiredValue => (props, propName) =>
  (props[propName] === desiredValue ? undefined : new Error('invalid typename'));

const BODY_TEXT = PropTypes.shape({
  __typename: createTypenameChecker(CONTENT_MODULE.BODY_TEXT),
  content: MARKDOWN.isRequired,
});

const INLINE_IMAGE = PropTypes.shape({
  __typename: createTypenameChecker(CONTENT_MODULE.INLINE_IMAGE),
  ...getInlineImagePropTypes(),
});

const INLINE_VIDEO = PropTypes.shape({
  __typename: createTypenameChecker(CONTENT_MODULE.INLINE_VIDEO),
  ...getInlineImagePropTypes(),
  videoEmbedCode: VIDEO_EMBED_CODE,
});

const LIST = {
  description1: MARKDOWN.isRequired,
  description2: MARKDOWN.isRequired,
  description3: MARKDOWN.isRequired,
  description4: MARKDOWN,
  description5: MARKDOWN,
  description6: MARKDOWN,
  description7: MARKDOWN,
  description8: MARKDOWN,
  title1: PropTypes.string.isRequired,
  title2: PropTypes.string.isRequired,
  title3: PropTypes.string.isRequired,
  title4: PropTypes.string,
  title5: PropTypes.string,
  title6: PropTypes.string,
  title7: PropTypes.string,
  title8: PropTypes.string,
};

const sectionTitlePropertyTypes = {
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

const SECTION_TITLE = PropTypes.shape({
  __typename: createTypenameChecker(CONTENT_MODULE.SECTION_TITLE),
  ...sectionTitlePropertyTypes,
});

const LIST_MODULE = PropTypes.shape({
  __typename: createTypenameChecker(CONTENT_MODULE.LIST),
  ...LIST,
});

const thumbnailListModulePropTypes = {
  item1Description: MARKDOWN.isRequired,
  item1ImageAlt: PropTypes.string.isRequired,
  item1Title: PropTypes.string.isRequired,
  item1VideoEmbedCode: VIDEO_EMBED_CODE,
  item2Description: MARKDOWN.isRequired,
  item2ImageAlt: PropTypes.string.isRequired,
  item2Title: PropTypes.string.isRequired,
  item2VideoEmbedCode: VIDEO_EMBED_CODE,
  item3Description: MARKDOWN.isRequired,
  item3ImageAlt: PropTypes.string.isRequired,
  item3Title: PropTypes.string.isRequired,
  item3VideoEmbedCode: VIDEO_EMBED_CODE,
  item4Description: MARKDOWN,
  item4ImageAlt: PropTypes.string,
  item4Title: PropTypes.string,
  item4VideoEmbedCode: VIDEO_EMBED_CODE,
  item5Description: MARKDOWN,
  item5ImageAlt: PropTypes.string,
  item5Title: PropTypes.string,
  item5VideoEmbedCode: VIDEO_EMBED_CODE,
  item6Description: MARKDOWN,
  item6ImageAlt: PropTypes.string,
  item6Title: PropTypes.string,
  item6VideoEmbedCode: VIDEO_EMBED_CODE,
  title: PropTypes.string.isRequired,
};

const THUMBNAIL_LIST = {
  imageSources: PropTypes.arrayOf(IMAGE_SOURCES).isRequired,
  ...thumbnailListModulePropTypes,
};

const THUMBNAIL_LIST_MODULE = PropTypes.shape({
  __typename: createTypenameChecker(CONTENT_MODULE.THUMBNAIL_LIST),
  ...thumbnailListModulePropTypes,
});

const OPENAPPLY_IFRAME = PropTypes.shape({
  __typename: createTypenameChecker(CONTENT_MODULE.OPENAPPLY_IFRAME),
  description: MARKDOWN.isRequired,
});

const quotePropTypes = {
  content: PropTypes.shape({
    content: PropTypes.string,
  }).isRequired,
  quoteType: PropTypes.string,
  source: PropTypes.string,
};

const QUOTE = PropTypes.shape({
  __typename: createTypenameChecker(CONTENT_MODULE.QUOTE),
  ...quotePropTypes,
});

const SLIDESHOW_CAROUSEL = PropTypes.shape({
  __typename: createTypenameChecker(CONTENT_MODULE.CAROUSEL),
  slides: PropTypes.arrayOf(PropTypes.shape(getInlineImagePropTypes(true))),
});

const threeUpBreakerPropTypes = {
  content1: MARKDOWN.isRequired,
  content2: MARKDOWN.isRequired,
  content3: MARKDOWN.isRequired,
  dimensions: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  title1: PropTypes.string.isRequired,
  title2: PropTypes.string.isRequired,
  title3: PropTypes.string.isRequired,
};

const THREE_UP_BREAKER = PropTypes.shape({
  __typename: createTypenameChecker(CONTENT_MODULE.THREE_UP_BREAKER),
  ...threeUpBreakerPropTypes,
});

const validateGlobalSettings = (props, propName) => {
  const globalSettings = props[propName];
  const isValid = Object.keys(globalSettings).every(language =>
    REGION_LANGUAGES[process.env.GATSBY_REGION].includes(language) && typeof globalSettings[language] === 'object');
  return isValid ? undefined : new Error('invalid global settings');
};

const footerLinkArray = PropTypes.arrayOf(PropTypes.shape({
  link: PropTypes.string.isRequired,
  subLinks: PropTypes.footerLinkArray,
  title: PropTypes.string.isRequired,
}));

const socialNetworkList = PropTypes.arrayOf(PropTypes.shape({
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  network: PropTypes.oneOf(Object.keys(SOCIAL_NETWORK)),
  shareLink: PropTypes.string,
  url: PropTypes.string,
}));

const LIST_ITEM = {
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const THUMBNAIL_LIST_ITEM = {
  description: MARKDOWN.isRequired,
  imageSources: IMAGE_SOURCES.isRequired,
  title: PropTypes.string.isRequired,
};

const EVENTS_LIST = {
  event1Date: PropTypes.string.isRequired,
  event1Description: MARKDOWN.isRequired,
  event1Location: PropTypes.string.isRequired,
  event1RegistrationLink: PropTypes.string.isRequired,
  event1TitleLine1: PropTypes.string.isRequired,
  event1TitleLine2: PropTypes.string,
  event2Date: PropTypes.string,
  event2Description: MARKDOWN,
  event2Location: PropTypes.string,
  event2RegistrationLink: PropTypes.string,
  event2TitleLine1: PropTypes.string,
  event2TitleLine2: PropTypes.string,
  event3Date: PropTypes.string,
  event3Description: MARKDOWN,
  event3Location: PropTypes.string,
  event3RegistrationLink: PropTypes.string,
  event3TitleLine1: PropTypes.string,
  event3TitleLine2: PropTypes.string,
  event4Date: PropTypes.string,
  event4Description: MARKDOWN,
  event4Location: PropTypes.string,
  event4RegistrationLink: PropTypes.string,
  event4TitleLine1: PropTypes.string,
  event4TitleLine2: PropTypes.string,
  event5Date: PropTypes.string,
  event5Description: MARKDOWN,
  event5Location: PropTypes.string,
  event5RegistrationLink: PropTypes.string,
  event5TitleLine1: PropTypes.string,
  event5TitleLine2: PropTypes.string,
};

const SCHOOLS_INTRO = PropTypes.shape({
  description: PropTypes.string,
  image: PropTypes.shape({
    alt: PropTypes.string.isRequired,
    sources: PropTypes.shape(validateSourcesBySize),
  }),
  link: PropTypes.string,
  title: PropTypes.string.isRequired,
});

const OPENING_COUNTDOWN = PropTypes.shape({
  date: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
});

const NAV_ITEM_LIST = PropTypes.arrayOf(PropTypes.shape({
  description: PropTypes.string.isRequired,
  id: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
  link: PropTypes.string.isRequired,
  slug: PropTypes.string,
  title: PropTypes.string.isRequired,
}));

const VIDEO = {
  alt: PropTypes.string.isRequired,
  imageSources: IMAGE_SOURCES,
  videoEmbedCode: VIDEO_EMBED_CODE,
};

const PROP_TYPES = {
  EVENTS_LIST,
  LIST,
  LIST_ITEM,
  SUB_NAV: {
    categoryTitle: PropTypes.string.isRequired,
    navItems: NAV_ITEM_LIST.isRequired,
  },
  THUMBNAIL_LIST_ITEM,
  VIDEO,
  WITH_VIDEO: {
    ...VIDEO,
    assetWithVideo: PropTypes.node.isRequired,
    hasPlayButton: PropTypes.bool,
  },
};

exports.PROP_TYPES = PROP_TYPES;

exports.PROP_SHAPES = {
  BREAKPOINT: PropTypes.oneOf(Object.keys(BREAKPOINTS_NAME)),
  FOOTER_DATA: PropTypes.shape({
    primaryLinks: footerLinkArray,
    utilityLinks: footerLinkArray,
  }),
  GLOBAL_SETTINGS: PropTypes.shape(validateGlobalSettings),
  HEADER_DATA: PropTypes.arrayOf(PropTypes.shape({
    link: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })),
  HERO: PropTypes.shape({
    eventListing: PropTypes.shape({
      list: EVENTS_LIST,
      title: PropTypes.string.isRequired,
    }),
    openingCountdown: OPENING_COUNTDOWN,
    schoolsIntro: SCHOOLS_INTRO,
  }),
  HISTORY: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  IMAGE_DATA_BY_TYPE: PropTypes.shape(validateImageDataByType),
  IMAGE_SOURCES,
  LANGUAGE: PropTypes.oneOf(REGION_LANGUAGES[process.env.GATSBY_REGION]),
  LOCALIZED_SLUG_LIST: PropTypes.arrayOf(PropTypes.shape({
    link: PropTypes.string.isRequired,
    locale: PropTypes.oneOf([
      LANGUAGE_CONTENTFUL_LOCALE[LANGUAGE.ENGLISH],
      LANGUAGE_CONTENTFUL_LOCALE[LANGUAGE.CHINESE],
    ]).isRequired,
  })),
  MARKDOWN,
  MODULES: PropTypes.arrayOf(PropTypes.oneOfType([
    BODY_TEXT,
    INLINE_IMAGE,
    INLINE_VIDEO,
    LIST_MODULE,
    OPENAPPLY_IFRAME,
    QUOTE,
    SECTION_TITLE,
    SLIDESHOW_CAROUSEL,
    THREE_UP_BREAKER,
    THUMBNAIL_LIST_MODULE,
  ])),
  NAV_ITEM_LIST,
  OPENING_COUNTDOWN,
  PAGE_TYPES: PropTypes.oneOf(PAGE_TYPES),
  SCHOOLS_INTRO,
  SOCIAL_ICONS: PropTypes.shape({
    contentPage: socialNetworkList.isRequired,
    footer: socialNetworkList.isRequired,
  }),
  SUB_NAV_PROPS: PropTypes.shape(PROP_TYPES.SUB_NAV),
  THUMBNAIL_LIST,
};
