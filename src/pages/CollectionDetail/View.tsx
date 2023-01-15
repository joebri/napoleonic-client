/** @jsxImportSource @emotion/react */

import { Link } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import {
  Edit as EditIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material';
import { Image } from 'cloudinary-react';

import { classes } from './CollectionDetail.style';

import { imageService, imageAccountName } from 'services/imageService';
import { Collection } from 'types';

const getUrl = (imagePublicId: string) => {
  const url = imageService.image(`${imagePublicId}`).format('auto').toURL();
  return url;
};

interface ViewProps {
  collection: Collection;
  onDelete: Function;
  onEdit: Function;
}

const View = ({ collection, onDelete, onEdit }: ViewProps) => {
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
          css={classes.button_spacer__x4}
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
        <Link to={`/?collection=${collection.tagName}||${collection.id}`}>
          Plates
        </Link>
      </div>

      {collection.descriptionLong && (
        <p dangerouslySetInnerHTML={{ __html: collection.descriptionLong }} />
      )}

      <div css={classes.container__link}>
        <Link to={`/?collection=${collection.tagName}||${collection.id}`}>
          Plates
        </Link>
      </div>

      <div css={classes.container__image}>
        <Image
          cloudName={imageAccountName}
          publicId={getUrl('/Napoleonic/GreeceBar_wphbeq')}
          secure="true"
        />
      </div>

      <Typography>Tag Name: "{collection.tagName}"</Typography>
    </div>
  );
};

export { View };
