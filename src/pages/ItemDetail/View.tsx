/** @jsxImportSource @emotion/react */

import { AdvancedImage } from '@cloudinary/react';
import styled from '@emotion/styled';
import { Button, Rating, Typography } from '@mui/material';
import {
  Edit as EditIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';

import { classes } from './ItemDetail.style';
import { TagInput } from 'components/TagInput/TagInput';

import { Item } from 'types';
import { useImageService } from 'hooks/useImageService';
import { useRatings } from './useRatings';

const Label = styled.label`
  font-weight: bold;
  margin-right: 0.25rem;
`;
const TagLabel = styled.label`
  font-weight: bold;
  margin-right: 0.5rem;
`;

interface ViewProps {
  item: Item;
  onDelete: Function;
  onEdit: Function;
}

const View = ({ item, onDelete, onEdit }: ViewProps) => {
  const [rating, setRating] = useState(0);

  const { ratingLabels, toUiRating } = useRatings();
  const { getImage } = useImageService();

  useEffect(() => {
    setRating(toUiRating(item.rating));
  }, [toUiRating, item.rating]);

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
          css={classes.button__spacerx4}
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
              <AdvancedImage
                cldImg={getImage(item.publicId)}
                css={classes.image}
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
      {item.regiments && (
        <p>
          <Label>Regiment(s):</Label>
          {item.regiments}
        </p>
      )}
      {(item.yearFrom || item.yearTo) && (
        <p>
          <Label>Year:</Label>
          {item.yearFrom}
          {item.yearTo ? <span> - {item.yearTo}</span> : ''}
        </p>
      )}
      <div css={classes.rating}>
        <Label>Rating:</Label>
        <Rating max={3} readOnly value={rating} />
        <span>{ratingLabels[rating]}</span>
      </div>

      <div css={classes.tags}>
        <TagLabel>Tags:</TagLabel>
        <TagInput tagNames={item.tags} isEdit={false} />
      </div>
    </div>
  );
};

export { View };
