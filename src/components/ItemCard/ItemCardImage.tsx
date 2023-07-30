import { AdvancedImage } from '@cloudinary/react';
import { lazyload, placeholder } from '@cloudinary/react';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import { useImageService } from 'hooks/useImageService';
import { Item } from 'types';

import styles from './ItemCard.module.scss';

const parseDescriptionForImage = (descriptionLong: string): string => {
  const match = descriptionLong.match(/<img src="([\w\W]+?)["][ ]?\/>/i);
  const url = match ? match[1] : '';
  return url;
};

interface ItemCardImageProps {
  item: Item;
}

const ItemCardImage = ({ item }: ItemCardImageProps) => {
  const [alternateImageUrl, setAlternateImageUrl] = useState('');
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const { getImage } = useImageService();

  useEffect(() => {
    if (!item.publicId) {
      const url = parseDescriptionForImage(item.descriptionLong);
      if (url) {
        setAlternateImageUrl(url);
      }
    }
  }, [item]);

  const handleImageClick = () => {
    setIsImageDialogOpen(true);
  };

  const handleImageDialogClose = () => {
    setIsImageDialogOpen(false);
  };

  return (
    <>
      {item.publicId ? (
        <>
          <AdvancedImage
            cldImg={getImage(item.publicId)}
            className={styles.image}
            onClick={handleImageClick}
            plugins={[placeholder(), lazyload()]}
            title={item.publicId}
          />
          {item.artist && (
            <Typography
              className={styles.artist}
              variant="body2"
              color="text.secondary"
            >
              {item.artist}
            </Typography>
          )}
        </>
      ) : (
        <>
          {alternateImageUrl && (
            <>
              <img src={alternateImageUrl} alt="uniform plate" />
              {item.artist && (
                <>
                  <Typography
                    className={styles.artist}
                    variant="body2"
                    color="text.secondary"
                  >
                    {item.artist}
                  </Typography>
                </>
              )}
            </>
          )}
        </>
      )}

      <Dialog onClose={handleImageDialogClose} open={isImageDialogOpen}>
        <AdvancedImage
          cldImg={getImage(item.publicId)}
          className={styles.imageFull}
        />
      </Dialog>
    </>
  );
};

export { ItemCardImage };
