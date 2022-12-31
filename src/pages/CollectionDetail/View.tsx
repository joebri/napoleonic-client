/** @jsxImportSource @emotion/react */

import { Link, useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import {
  Edit as EditIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material';
import WindowIcon from '@mui/icons-material/Window';
import { Image } from 'cloudinary-react';

import { classes } from './CollectionDetail.style';

import { imageService, imageAccountName } from 'services/imageService';
import { Item } from 'types';
import { TagInput } from 'components/TagInput/TagInput';

const getUrl = (imagePublicId: string) => {
  const url = imageService.image(`${imagePublicId}`).format('auto').toURL();
  return url;
};

interface ViewProps {
  item: Item;
  onDelete: Function;
  onEdit: Function;
}

const View = ({ item, onDelete, onEdit }: ViewProps) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/collections');
  };

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
          css={classes.button_spacer}
          onClick={handleHomeClick}
          size="small"
          startIcon={<WindowIcon />}
          variant="contained"
        >
          Home
        </Button>
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

      <Typography variant="h2">{item.title}</Typography>

      {item.descriptionShort && (
        <Typography variant="h3">{item.descriptionShort}</Typography>
      )}

      <div css={classes.container__link}>
        <Link to={`/?collection=${item.id}`}>Plates</Link>
      </div>

      {item.descriptionLong && (
        <p dangerouslySetInnerHTML={{ __html: item.descriptionLong }} />
      )}

      <div css={classes.container__link}>
        <Link to={`/?collection=${item.id}`}>Plates</Link>
      </div>

      <div css={classes.container__image}>
        <Image
          cloudName={imageAccountName}
          publicId={getUrl('/Napoleonic/GreeceBar_wphbeq')}
          secure="true"
        />
      </div>

      <div css={classes.tags}>
        <TagInput tagNames={item.tags} isEdit={false} />
      </div>
    </div>
  );
};

export { View };
