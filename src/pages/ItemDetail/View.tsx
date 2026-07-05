import { TagInput } from '@components/TagInput/TagInput';
import { Item } from '@models/Item.model';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Rating, Typography } from '@mui/material';
import { getLocalImage } from '@utilities/imageService';
import { useEffect, useState } from 'react';

import styles from './ItemDetail.module.scss';
import { ratingLabels, toUiRating } from './ItemDetailHelper';

interface ViewProps {
    item: Item;
    onDelete: () => void;
    onEdit: () => void;
}

export const View = ({ item, onDelete, onEdit }: ViewProps) => {
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
                <Box
                    sx={{
                        '& table': {
                            borderCollapse: 'collapse',
                            tableLayout: 'fixed',
                            width: '100%',
                            margin: '1rem 0',
                            overflow: 'hidden',
                        },
                        '& td, & th': {
                            minWidth: '1em',
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                            verticalAlign: 'top',
                            boxSizing: 'border-box',
                        },
                        '& th': {
                            fontWeight: 'bold',
                            textAlign: 'left',
                            backgroundColor: '#f5f5f5',
                        },
                        '& h2': {
                            marginBlockEnd: 0,
                        },
                        '& h2 + p': {
                            marginBlockStart: 0.2,
                        },
                    }}
                >
                    <p
                        dangerouslySetInnerHTML={{
                            __html: item.descriptionLong,
                        }}
                    />
                </Box>
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
