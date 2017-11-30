import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GatsbyLink from 'gatsby-link';

import { getIsoCode } from '../../../utils/regions';
import { KEYS } from '../../../constants/keys';
import { PROP_TYPES } from '../../../constants/custom-property-types';

const propTypes = {
  children: PropTypes.node.isRequired,
  shouldOpenExternalInSameTab: PropTypes.bool,
  shouldSkipIsoCode: PropTypes.bool,
  shouldVisitLinkOnEnter: PropTypes.bool,
  refFn: PropTypes.func,
  to: PropTypes.string.isRequired,
};

class Link extends Component {
  handleExternalKeyDown = ({ keyCode, target }) => {
    if (keyCode === KEYS.enter) {
      window.location = target.href;
    }
  }

  handleInternalKeyDown = ({ keyCode, target }) => {
    if (keyCode === KEYS.enter) {
      // We need to use getAttribute here to get the relative href
      this.context.history.push(target.getAttribute('href'));
    }
  }

  render() {
    const {
      children,
      refFn,
      shouldOpenExternalInSameTab,
      shouldSkipIsoCode,
      shouldVisitLinkOnEnter,
      to,
      ...props
    } = this.props;
    const { language } = this.context;

    if (/^http/.test(to)) {
      return (
        <a
          href={to}
          onKeyDown={shouldVisitLinkOnEnter && this.handleExternalKeyDown}
          ref={(el) => { if (refFn) refFn(el); }}
          rel="noopener noreferrer"
          target={shouldOpenExternalInSameTab ? undefined : '_blank'}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <GatsbyLink
        innerRef={(el) => { if (refFn) refFn(el); }}
        onKeyDown={shouldVisitLinkOnEnter && this.handleInternalKeyDown}
        to={shouldSkipIsoCode ? to : `/${getIsoCode(language)}${to}`}
        {...props}
      >
        {children}
      </GatsbyLink>
    );
  }
}

Link.propTypes = propTypes;
Link.contextTypes = {
  history: PROP_TYPES.HISTORY.isRequired,
  language: PROP_TYPES.LANGUAGE.isRequired,
};

export default Link;
