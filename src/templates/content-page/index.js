import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { CookiesProvider } from 'react-cookie';

import ContentModules from '../../content-modules';
import PageHead from '../../components/structural/page-head';
import Share from '../../components/structural/share';
import PageWrapper from '../../components/structural/page-wrapper';
import PageVisited from '../../components/structural/page-visited';

import { PROP_SHAPES } from '../../constants/custom-property-types';
import { IMAGE_TYPE } from '../../constants/images';
import {
  transformLocalizedSlugData,
  transformSubnavProps,
} from '../../utils/nav';
import { removeMarkdown } from '../../utils/strings';
import { cleanImageData } from '../../utils/images';

const propTypes = {
  // TODO FIX data prop type
  data: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  pathContext: PropTypes.shape({
    id: PropTypes.string.isRequired,
    imageDataByType: PROP_SHAPES.IMAGE_DATA_BY_TYPE.isRequired,
  }).isRequired,
};

class ContentPageTemplate extends Component {
  state = {
    lastElementBottom: 0,
    viewed: false,
  };

  getChildContext() {
    const { data: { localizedSlugData } } = this.props;

    return {
      localizedSlugList: transformLocalizedSlugData(localizedSlugData),
    };
  }

  setLastElementBottom = (lastElementBottom) => {
    this.setState({ lastElementBottom });
  };

  shouldDisableFab = () => {
    const { fabLinkInternal } = this.context;
    if (fabLinkInternal) {
      const pageData = this.props.data.currentPageData;
      const fabCategory = fabLinkInternal.parentCategory ?
        fabLinkInternal.parentCategory[0].slug : fabLinkInternal.slug;

      if ((pageData.parentCategory && pageData.parentCategory[0].categorySlug === fabCategory)
          || pageData.categorySlug === fabCategory) {
        return true;
      }
    }
    return false;
  }

  viewedPage = (viewed) => {
    this.setState({ viewed });
  };

  render() {
    const {
      data: { currentPageData },
      pathContext: { id, imageDataByType },
    } = this.props;
    const {
      hasShareButtons,
      headline,
      mainImageAlt,
      modules,
      overviewNavTitle,
      navDescription,
      navTitle,
      pageType,
      parentCategory,
      categorySlug,
      seoMetaDescription,
      seoMetaKeywords,
      seoMetaTitle,
      subcategories,
      subhead,
    } = currentPageData;

    let subNavProps;

    if (parentCategory) {
      subNavProps = transformSubnavProps({
        ...parentCategory[0],
        currentPageId: id,
        currentPageType: pageType,
        parentCategoryId: parentCategory[0].id,
      });
    } else if (subcategories) {
      subNavProps = transformSubnavProps({
        categoryDescription: navDescription,
        categorySlug,
        categoryTitle: navTitle,
        currentPageId: id,
        currentPageType: pageType,
        overviewNavTitle,
        parentCategoryId: id,
        subcategories,
      });
    }

    const metaDescription = (seoMetaDescription && seoMetaDescription.content) ||
      navDescription ||
      subhead;
    const metaKeywords = seoMetaKeywords && seoMetaKeywords.content;
    const metaTitle = seoMetaTitle || navTitle || removeMarkdown(headline);

    const mainImageSources = imageDataByType[IMAGE_TYPE.MAIN];

    const metaProps = {
      description: metaDescription,
      imageSources: mainImageSources,
      keywords: metaKeywords,
      title: metaTitle,
      type: pageType,
    };

    return (
      <CookiesProvider>
        <PageVisited
          lastElementBottom={this.state.lastElementBottom}
          pageId={id}
          viewedPage={this.viewedPage}
        >
          <PageWrapper
            metaProps={metaProps}
            setLastElementBottom={this.setLastElementBottom}
            shouldDisableFab={this.shouldDisableFab()}
            subNavProps={subNavProps}
            viewedPage={this.state.viewed}
          >
            <div>
              <PageHead
                headline={headline}
                imageAlt={mainImageAlt}
                imageSources={mainImageSources}
                subhead={subhead}
                type={pageType}
              />
              {modules && (
                <ContentModules
                  moduleImageData={cleanImageData(imageDataByType[IMAGE_TYPE.MODULE])}
                  modules={modules}
                />
              )}
              {hasShareButtons && <Share />}
            </div>
          </PageWrapper>
        </PageVisited>
      </CookiesProvider>
    );
  }
}

ContentPageTemplate.propTypes = propTypes;
ContentPageTemplate.contextTypes = {
  fabLinkInternal: PropTypes.object,
};

ContentPageTemplate.childContextTypes = {
  localizedSlugList: PROP_SHAPES.LOCALIZED_SLUG_LIST.isRequired,
};

export default ContentPageTemplate;

export const pageQuery = graphql`
  fragment commonNavProps on ContentfulContentPage {
    overviewNavTitle
    categorySlug: slug
    id: contentful_id
    subcategories {
      description: navDescription
      id: contentful_id
      slug
      title: navTitle
    }
  }

  query contentPageQuery($id: String!, $locale: String!) {
    localizedSlugData: allContentfulContentPage(
      filter: { contentful_id: { eq: $id } }
    ) {
      edges {
        node {
          locale: node_locale
          slug
          parentCategory: contentpage {
            slug
          }
        }
      }
    }

    currentPageData: contentfulContentPage(
      contentful_id: { eq: $id },
      node_locale: { eq: $locale }
    ) {
      hasShareButtons
      headline
      mainImageAlt
      navTitle
      navDescription
      pageType
      seoMetaDescription {
        content: seoMetaDescription
      }
      seoMetaKeywords {
        content: seoMetaKeywords
      }
      seoMetaTitle
      subhead

      # SUBNAV PROPERTIES - CATEGORY
      ...commonNavProps

      # SUBNAV PROPERTIES - NESTED ARTICLE
      parentCategory: contentpage {
        categoryTitle: navTitle
        categoryDescription: navDescription
        ...commonNavProps
      }

      modules {
        __typename
        ... on ContentfulBodyText {
          content {
            markdown: content
          }
        }
        ... on ContentfulInlineImage {
          shape
          alt
          caption
        }
        ... on ContentfulInlineVideo{
          alt
          caption
          videoEmbedCode {
            embedCode: videoEmbedCode
          }
        }
        ... on ContentfulOpenApplyIFrame {
          description {
            markdown: description
          }
          scriptTags {
            scriptTags
          }
        }
        ... on ContentfulQuote {
          quoteType
          content {
            content
          }
          source
        }
        ... on ContentfulSlideshowCarousel {
          slides {
            shape
            alt
            caption
          }
        }
        ... on ContentfulThreeUpBreaker {
          content1 {
            markdown: content1
          }
          content2 {
            markdown: content2
          }
          content3 {
            markdown: content3
          }
          title1
          title2
          title3
        }
        ... on ContentfulList {
          description1 {
            markdown: description1
          }
          description2 {
            markdown: description2
          }
          description3 {
            markdown: description3
          }
          description4 {
            markdown: description4
          }
          description5 {
            markdown: description5
          }
          description6 {
            markdown: description6
          }
          description7 {
            markdown: description7
          }
          description8 {
            markdown: description8
          }
          title1
          title2
          title3
          title4
          title5
          title6
          title7
          title8
        }
        ... on ContentfulSectionTitle {
          number
          title
        }
        ... on ContentfulPost {
          date
          title
          source
          description {
            markdown: description
          }
          linkInternal {
            slug
            parentCategory: contentpage {
              slug
            }
          }
          linkExternal
        }
        ... on ContentfulThumbnailList {
          item1Description {
            markdown: item1Description
          }
          item2Description {
            markdown: item2Description
          }
          item3Description {
            markdown: item3Description
          }
          item4Description {
            markdown: item4Description
          }
          item5Description {
            markdown: item5Description
          }
          item6Description {
            markdown: item6Description
          }
          item1Title
          item2Title
          item3Title
          item4Title
          item5Title
          item6Title
          item1ImageAlt
          item2ImageAlt
          item3ImageAlt
          item4ImageAlt
          item5ImageAlt
          item6ImageAlt
          item1VideoDuration
          item2VideoDuration
          item3VideoDuration
          item4VideoDuration
          item5VideoDuration
          item6VideoDuration
          item1VideoEmbedCode {
            embedCode: item1VideoEmbedCode
          }
          item2VideoEmbedCode {
            embedCode: item2VideoEmbedCode
          }
          item3VideoEmbedCode {
            embedCode: item3VideoEmbedCode
          }
          item4VideoEmbedCode {
            embedCode: item4VideoEmbedCode
          }
          item5VideoEmbedCode {
            embedCode: item5VideoEmbedCode
          }
          item6VideoEmbedCode {
            embedCode: item6VideoEmbedCode
          }
          title
        }
        ... on ContentfulTeams {
          sectionTitleText: sectionTitle
          heroImageAlt
          heroName
          heroTitle
          heroDescription {
            markdown: heroDescription
          }
          heroLinkTarget: heroLinkDestination {
            slug
            parentCategory: contentpage {
              slug
            }
          }
          statistic1Number1
          statistic1Number2
          statistic1TextLineBottom
          statistic1TextLineTop
          statistic1Type
          statistic2Number1
          statistic2Number2
          statistic2TextLineBottom
          statistic2TextLineTop
          statistic2Type
          sections {
            sectionTitle
            sectionLinkDestination {
              slug
              parentCategory: contentpage {
                slug
              }
            }
            person1ImageAlt
            person1Name
            person1Title
            person1Description {
              markdown: person1Description
            }
            person2ImageAlt
            person2Name
            person2Title
            person2Description {
              markdown: person2Description
            }
            person3ImageAlt
            person3Name
            person3Title
            person3Description {
              markdown: person3Description
            }
            person4ImageAlt
            person4Name
            person4Title
            person4Description {
              markdown: person4Description
            }
            person5ImageAlt
            person5Name
            person5Title
            person5Description {
              markdown: person5Description
            }
            person6ImageAlt
            person6Name
            person6Title
            person6Description {
              markdown: person6Description
            }
          }
        }
        ... on ContentfulVideos {
          title
          video1Title
          video1Link {
            linkDestinationExternal
            linkDestinationInternal {
              slug
              parentCategory: contentpage {
                slug
              }
            }
          }
          video1Description {
            markdown: video1Description
          }
          video1ImageVideoAlt
          video1VideoEmbedCode {
            embedCode: video1VideoEmbedCode
          }
          video2Title
          video2Link {
            linkDestinationExternal
            linkDestinationInternal {
              slug
              parentCategory: contentpage {
                slug
              }
            }
          }
          video2Description {
            markdown: video2Description
          }
          video2ImageVideoAlt
          video2VideoEmbedCode {
            embedCode: video2VideoEmbedCode
          }
          video3Title
          video3Link {
            linkDestinationExternal
            linkDestinationInternal {
              slug
              parentCategory: contentpage {
                slug
              }
            }
          }
          video3Description {
            markdown: video3Description
          }
          video3ImageVideoAlt
          video3VideoEmbedCode {
            embedCode: video3VideoEmbedCode
          }

        }
      }
    }
  }
`;
