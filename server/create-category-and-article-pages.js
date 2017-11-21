const path = require('path');

const { LANGUAGE_CONTENTFUL_LOCALE, REGION_LANGUAGES } = require('../src/constants/regions');
const { IMAGE_TYPE, IMAGE_SUBTYPE } = require('../src/constants/images');
const { getIsoCode } = require('../src/utils/regions');
const {
  createQuery,
  saveInlineImage,
  saveMainImage,
} = require('./save-images');

const createCategoryAndArticlePages = (graphql, createPage) => {
  const promises = REGION_LANGUAGES[process.env.GATSBY_REGION].map(language =>
    new Promise((resolve, reject) => {
      // query run on all content pages,
      // whether category or article, top-level or nested
      const sharedQuery = `
        id
        pageType
        slug

        articleMainImage: mainImage {
          ${createQuery(IMAGE_SUBTYPE.MAIN_ARTICLE)}
        }

        modules {
          __typename
          ... on ContentfulInlineImage {
            shape
            squareInlineImage: asset {
              ${createQuery(IMAGE_SUBTYPE.INLINE_SQ)}
            }
            rectInlineImage: asset {
              ${createQuery(IMAGE_SUBTYPE.INLINE_RT)}
            }
          }
        }
      `;

      graphql(`
          {
            allContentfulContentPage(
              filter: {
                node_locale: { eq: "${LANGUAGE_CONTENTFUL_LOCALE[language]}" }
              }
            ) {
              edges {
                node {
                  ${sharedQuery}

                  categoryMainImage: mainImage {
                    ${createQuery(IMAGE_SUBTYPE.MAIN_CATEGORY)}
                  }

                  parentCategory: contentpage {
                    id
                  }
                  subcategories {
                    ${sharedQuery}
                  }
                }
              }
            }
          }
        `).then((result) => {
        if (result.errors) {
          reject(result.errors);
        }

        const contentPageTemplate = path.resolve('./src/templates/content-page/index.js');
        const isoCode = getIsoCode(language);

        const buildPage = (id, slugs, imageDataByType) => {
          createPage({
            path: `${isoCode}/${slugs.join('/')}/`,
            component: contentPageTemplate,
            context: {
              id,
              imageDataByType,
            },
          });
        };

        const buildPageAndSubcategories = (node, prevSlugs = []) => {
          const setupPromises = [];
          const {
            id, modules, slug, subcategories,
          } = node;
          const slugs = [...prevSlugs, slug];

          const imageDataByType = {};

          const mainImagePromise = saveMainImage(node);
          if (mainImagePromise) {
            setupPromises.push(mainImagePromise.then((imageData) => {
              imageDataByType[IMAGE_TYPE.MAIN] = imageData;
            }));
          }

          if (modules) {
            const modulePromises = modules.map((n, i) => {
              const { __typename } = n;
              if (__typename === 'ContentfulInlineImage') {
                return saveInlineImage(n, i);
              }

              return undefined;
            });

            setupPromises.push(Promise.all(modulePromises).then((imageData) => {
              imageDataByType[IMAGE_TYPE.INLINE] = imageData;
            }));
          }


          if (subcategories) {
            const subcategoryPromises = subcategories.map(subcat => buildPageAndSubcategories(subcat, slugs));
            setupPromises.push(Promise.all(subcategoryPromises));
          }

          return Promise.all(setupPromises).then(() => buildPage(id, slugs, imageDataByType));
        };

        const createPagePromises = result.data.allContentfulContentPage.edges.map(({ node }) => {
          // Skip subcategories
          if (node.parentCategory) return undefined;
          return buildPageAndSubcategories(node);
        });

        return Promise.all(createPagePromises).then(resolve);
      });
    }));

  return Promise.all(promises);
};

module.exports = createCategoryAndArticlePages;