import { useLazyQuery } from '@apollo/client';
import { Cloudinary } from '@cloudinary/url-gen';

import { useLogError } from 'hooks/useLogError';
import { ItemMetaData } from 'types';
import { readItemMetaDataQuery } from './queries/readItemMetaDataQuery';

const imageService: any = (() => {
  console.info(
    `%cInitialising image service for ${process.env.REACT_APP_CLOUDINARY_NAME}`,
    'color:blue'
  );
  return new Cloudinary({
    cloud: {
      cloudName: process.env.REACT_APP_CLOUDINARY_NAME,
    },
  });
})();

const useImageService = () => {
  const { logError } = useLogError(`${useImageService.name}.ts`);

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
