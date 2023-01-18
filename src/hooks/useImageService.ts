import { Cloudinary } from '@cloudinary/url-gen';
import { useLazyQuery } from '@apollo/client';

import readItemMetaDataQuery from './queries/readItemMetaDataQuery';
import { useLogError } from 'hooks/useLogError';
import { ItemMetaData } from 'types';

const imageService: any = (() => {
  console.log('initialising image service...');
  return new Cloudinary({
    cloud: {
      cloudName: process.env.REACT_APP_CLOUDINARY_NAME,
    },
  });
})();

const useImageService = () => {
  const { logError } = useLogError(useImageService.name);

  const [readItemMetaData] = useLazyQuery(readItemMetaDataQuery, {
    onError: (exception) => {
      logError({ name: 'useImageService', exception });
      throw new Error(exception.message);
    },
  });

  const getImage = (uri: string) => {
    const img = imageService.image(uri).quality('auto').format('auto');
    return img;
  };

  const getMetaData = async (publicId: string): Promise<ItemMetaData> => {
    const metaData: ItemMetaData = (
      await readItemMetaData({ variables: { publicId } })
    ).data.readItemMetaData;
    return metaData;
  };

  return { getImage, getMetaData };
};
export { useImageService };
