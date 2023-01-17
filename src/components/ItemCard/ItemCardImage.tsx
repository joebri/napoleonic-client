/** @jsxImportSource @emotion/react */

import { AdvancedImage } from '@cloudinary/react';
import { lazyload, placeholder } from '@cloudinary/react';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';

import { classes } from './ItemCard.style';

import { Item } from 'types';
import { useImageService } from 'hooks/useImageService';

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
            css={classes.image}
            onClick={handleImageClick}
            plugins={[lazyload(), placeholder()]}
            title={item.publicId}
          />
          {item.artist && (
            <Typography
              css={[classes.artist]}
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
                    css={[classes.artist]}
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
          css={classes.imageFull}
        />
      </Dialog>
    </>
  );
};

export { ItemCardImage };
