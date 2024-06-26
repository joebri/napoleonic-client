import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Rating, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { TagInput } from 'components/TagInput/TagInput';

import { Item } from 'types';
import { getLocalImage } from 'utilities/imageService';

import styles from './ItemDetail.module.scss';
import { ratingLabels, toUiRating } from './ItemDetailHelper';

interface ViewProps {
    item: Item;
    onDelete: Function;
    onEdit: Function;
}

const View = ({ item, onDelete, onEdit }: ViewProps) => {
    const [rating, setRating] = useState(0);

    useEffect(() => {
        setRating(toUiRating(item.rating));
    }, [item.rating]);

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
                    aria-label="edit"
                    className={styles.buttonSpacerX4}
                    onClick={handleEditClick}
                    size="small"
                    startIcon={<EditIcon />}
                    variant="contained"
                >
                    Edit
                </Button>
                <Button
                    aria-label="delete"
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
            <div className={styles.containerImage}>
                {item.publicId && (
                    <>
                        <div>
                            <img
                                alt=""
                                className={styles.image}
                                src={getLocalImage(item.publicId)}
                                title={item.publicId}
                            />
                        </div>
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
                )}
            </div>
            {item.regiments && (
                <p>
                    <label>Regiment(s):</label>
                    {item.regiments}
                </p>
            )}
            {(item.yearFrom || item.yearTo) && (
                <p>
                    <label>Year:</label>
                    {item.yearFrom}
                    {item.yearTo ? <span> - {item.yearTo}</span> : ''}
                </p>
            )}
            <div className={styles.rating}>
                <label>Rating:</label>
                <Rating max={3} readOnly value={rating} />
                <span>{ratingLabels[rating]}</span>
            </div>

            <div className={styles.tags}>
                <label>Tags:</label>
                <TagInput tagNames={item.tags} isEdit={false} />
            </div>
        </div>
    );
};

export { View };
