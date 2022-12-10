import { Cloudinary } from '@cloudinary/url-gen';
import useConfig from '../hooks/useConfig';

export const imageAccountName = (() => {
  return useConfig('CLOUDINARY_NAME');
})();

export const imageService = new Cloudinary({
  cloud: {
    cloudName: 'ezenix',
  },
});
