/** @jsxImportSource @emotion/react */

import { Link } from 'react-router-dom';
import { AdvancedImage } from '@cloudinary/react';
import { Button, Typography } from '@mui/material';
import {
  Edit as EditIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material';

import { classes } from './CollectionDetail.style';

import { Collection } from 'types';
import { useImageService } from 'hooks/useImageService';

interface ViewProps {
  collection: Collection;
  onDelete: Function;
  onEdit: Function;
}

const View = ({ collection, onDelete, onEdit }: ViewProps) => {
  const { getImage } = useImageService();

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
          css={classes.button_spacer_x4}
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

      <Typography variant="h2">{collection.title}</Typography>

      {collection.descriptionShort && (
        <Typography variant="h3">{collection.descriptionShort}</Typography>
      )}

      <div css={classes.container__link}>
        <Link
          to={`/gallery?collection=${collection.tagName}||${collection.title}||${collection.id}`}
        >
          Plates
        </Link>
      </div>

      {collection.descriptionLong && (
        <p dangerouslySetInnerHTML={{ __html: collection.descriptionLong }} />
      )}

      <div css={classes.container__link}>
        <Link
          to={`/gallery?collection=${collection.tagName}||${collection.title}||${collection.id}`}
        >
          Plates
        </Link>
      </div>

      <div css={classes.container__image}>
        <AdvancedImage cldImg={getImage('/Napoleonic/GreeceBar_wphbeq')} />
      </div>

      <Typography>Tag Name: "{collection.tagName}"</Typography>
    </div>
  );
};

export { View };
