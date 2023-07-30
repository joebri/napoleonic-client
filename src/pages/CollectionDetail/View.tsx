import { AdvancedImage } from '@cloudinary/react';
import DeleteForeverIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { useImageService } from 'hooks/useImageService';
import { Collection } from 'types';

import styles from './CollectionDetail.module.scss';

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
      <div className={styles.actionBar}>
        <Button
          className={styles.buttonSpacerX4}
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

      <div className={styles.container__link}>
        <Link
          to={`/gallery?collection=${collection.tagName}||${collection.title}||${collection.id}`}
        >
          Plates
        </Link>
      </div>

      {collection.descriptionLong && (
        <p dangerouslySetInnerHTML={{ __html: collection.descriptionLong }} />
      )}

      <div className={styles.container__link}>
        <Link
          to={`/gallery?collection=${collection.tagName}||${collection.title}||${collection.id}`}
        >
          Plates
        </Link>
      </div>

      <div className={styles.container__image}>
        <AdvancedImage cldImg={getImage('/Napoleonic/GreeceBar_wphbeq')} />
      </div>

      <Typography>Tag Name: "{collection.tagName}"</Typography>
    </div>
  );
};

export { View };
