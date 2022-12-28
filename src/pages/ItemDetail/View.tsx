/** @jsxImportSource @emotion/react */

import { Button, Typography } from '@mui/material';
import {
  Edit as EditIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material';
import { Image } from 'cloudinary-react';

import { classes } from './ItemDetail.style';
import { imageService, imageAccountName } from '../../services/imageService';
import { TagInput } from '../../components/TagInput/TagInput';
import { Item } from '../../types';
import { Rating } from '../../enums/rating.enum';

const getUrl = (imagePublicId: string) => {
  const url = imageService.image(`${imagePublicId}`).format('auto').toURL();
  return url;
};

const ratingToString = (rating: number) => {
  switch (rating) {
    case Rating.HIGH:
      return 'High';
    case Rating.MEDIUM:
      return 'Medium';
    case Rating.LOW:
      return 'Low';
    default:
      return 'n/a';
  }
};

interface ViewProps {
  item: Item;
  onDelete: Function;
  onEdit: Function;
}

const View = ({ item, onDelete, onEdit }: ViewProps) => {
  const handleEditClick = () => {
    onEdit();
  };

  const handleDeleteClick = () => {
    onDelete();
  };

  return (
    <div>
      <div css={classes.actionBar}>
        <Button
          css={classes.button__spacer__x4}
          onClick={handleEditClick}
          size="small"
          startIcon={<EditIcon />}
          variant="contained"
        >
          Edit
        </Button>
        <Button
          onClick={handleDeleteClick}
          size="small"
          startIcon={<DeleteForeverIcon />}
          variant="outlined"
        >
          Delete
        </Button>
      </div>

      <Typography variant="h2">{item.title}</Typography>

      {item.descriptionShort && (
        <Typography variant="h3">{item.descriptionShort}</Typography>
      )}

      {item.descriptionLong && (
        <p dangerouslySetInnerHTML={{ __html: item.descriptionLong }} />
      )}

      <div css={classes.container_image}>
        {item.publicId && (
          <>
            <div>
              <Image
                css={classes.image}
                cloudName={imageAccountName}
                publicId={getUrl(item.publicId)}
                secure="true"
                title={item.publicId}
              />
            </div>
            {item.artist && (
              <Typography
                css={classes.artist}
                variant="body2"
                color="text.secondary"
              >
                {item.artist}
              </Typography>
            )}
          </>
        )}
      </div>

      {item.regiments && <p>Regiment(s): {item.regiments}</p>}

      {(item.yearFrom || item.yearTo) && (
        <p>
          Year: {item.yearFrom}
          {item.yearTo ? <span> - {item.yearTo}</span> : ''}
        </p>
      )}

      <p>Rating: {ratingToString(item.rating)}</p>

      <div css={classes.tags}>
        <TagInput tagNames={item.tags} isEdit={false} />
      </div>
    </div>
  );
};

export { View };
