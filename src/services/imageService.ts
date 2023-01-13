import { Cloudinary } from '@cloudinary/url-gen';

export const imageAccountName = (() => {
  return process.env.REACT_APP_CLOUDINARY_NAME;
})();

export const imageService = new Cloudinary({
  cloud: {
    cloudName: imageAccountName,
  },
});
