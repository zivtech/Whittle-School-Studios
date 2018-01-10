const { IMAGE_SIZE, IMAGE_MQ } = require('../constants/images');

exports.adaptSourcesBySize = (sourcesBySize) => {
  // We use the IMAGE_SIZE keys to ensure breakpoints
  // are in the correct order
  const sourceList = Object.values(IMAGE_SIZE).reduce((acc, breakpoint) => {
    const sourceInfo = sourcesBySize[breakpoint];
    if (sourceInfo) {
      acc.push({
        media: IMAGE_MQ[breakpoint],
        src: sourceInfo.src,
        srcSet: sourceInfo.srcSet,
      });
    }
    return acc;
  }, []);

  const largestSrc = sourceList[sourceList.length - 1] ? sourceList[sourceList.length - 1].src : '';

  return {
    largestSrc,
    sourceList,
  };
};

/*
   Image URL formats are:
   //images.contentful.com/[space id]/[image id]/[image locale id]/filename

   Example:
   //images.contentful.com/udx5f2jyw09i/5iM0C8Tviguwks0kMCkyQE/95e623e0bdf68408c3206d8cc495ea56/campus.jpg
*/

exports.getIdFromImgUrl = (url) => {
  const matches = url.match(/\/\/images\.contentful\.com\/\w+\/(\w+)/);
  return matches && matches[1];
};

exports.getLocaleIdFromImgUrl = (url) => {
  const matches = url.match(/\/\/images\.contentful\.com\/\w+\/\w+\/(\w+)/);
  return matches && matches[1];
};

const cleanImageSources = imageSources =>
  (imageSources && Object.keys(imageSources).length ? imageSources : undefined);

exports.cleanImageData = imageData =>
  imageData.map(data =>
    (Array.isArray(data) ? data.map(cleanImageSources) : cleanImageSources(data)));
