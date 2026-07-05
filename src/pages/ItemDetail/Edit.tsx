import { RichTextEditor } from '@components/RichTextEditor/RichTextEditor';
import { TagInput } from '@components/TagInput/TagInput';
import { useConfirmExit } from '@hooks/useConfirmExit';
import { Item } from '@models/Item.model';
import BackspaceOutlinedIcon from '@mui/icons-material/Backspace';
import SaveIcon from '@mui/icons-material/Save';
import { Button, InputLabel, Rating, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import {
    ChangeEvent,
    KeyboardEvent,
    SyntheticEvent,
    useEffect,
    useState,
} from 'react';

import styles from './ItemDetail.module.scss';
import { ratingLabels, toItemRating, toUiRating } from './ItemDetailHelper';

type EditProps = {
    item: Item;
    onCancel: () => void;
    onSave: (updatedItem: Item) => void;
};

export const Edit = ({ item, onCancel, onSave }: EditProps) => {
    const [formState, setFormState] = useState<Item>({ ...item });
    const [isDirty, setIsDirty] = useState(false);
    const [ratingHovered, setRatingHovered] = useState(-1);
    const [rating, setRating] = useState(2);

    useConfirmExit(isDirty);

    useEffect(() => {
        setFormState({ ...item });
        setRating(toUiRating(item.rating));
    }, [item]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormState((previous) => ({
            ...previous,
            [name]: value,
        }));
        setIsDirty(true);
    };

    const handleLongDescriptionChange = (html: string) => {
        setFormState((previous) => ({
            ...previous,
            descriptionLong: html,
        }));
        setIsDirty(true);
    };

    const handleTagsChange = (tags: string[]) => {
        setFormState((previous) => ({
            ...previous,
            tags: tags,
        }));
        setIsDirty(true);
    };

    const handleRatingChange = (_: SyntheticEvent, value: number | null) => {
        const calculatedRating = toItemRating(value);
        setRating(toUiRating(calculatedRating));
        setFormState((previous) => ({
            ...previous,
            rating: calculatedRating,
        }));
        setIsDirty(true);
    };

    const handleCancelClick = () => {
        onCancel();
    };

    const handleSaveClick = () => {
        onSave(formState);
    };

    const handleOnKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.code === 'KeyS') {
            event.preventDefault();
            onSave(formState);
        }
    };

    return (
        <div onKeyDown={handleOnKeyDown}>
            <div className={styles.actionBar}>
                <Button
                    aria-label="save"
                    className={styles.buttonSpacer}
                    disabled={!isDirty}
                    onClick={handleSaveClick}
                    size="small"
                    startIcon={<SaveIcon />}
                    variant="contained"
                >
                    Save
                </Button>
                <Button
                    aria-label="cancel"
                    onClick={handleCancelClick}
                    size="small"
                    startIcon={<BackspaceOutlinedIcon />}
                    variant="outlined"
                >
                    Cancel
                </Button>
            </div>

            <TextField
                fullWidth
                label="Title"
                margin="normal"
                name="title"
                onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }}
                value={formState.title || ''}
                variant="standard"
            />
            <TextField
                fullWidth
                label="Subtitle"
                margin="normal"
                name="descriptionShort"
                onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }}
                value={formState.descriptionShort || ''}
                variant="standard"
            />

            <RichTextEditor
                initialContent={formState.descriptionLong}
                label="Long Description"
                onChange={handleLongDescriptionChange}
            />

            <TextField
                fullWidth
                label="Regiment(s)"
                margin="normal"
                name="regiments"
                onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }}
                value={formState.regiments || ''}
                variant="standard"
            />
            <TextField
                fullWidth
                label="Image url"
                margin="normal"
                name="publicId"
                onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }}
                value={formState.publicId || ''}
                variant="standard"
            />
            <TextField
                fullWidth
                label="Artist"
                margin="normal"
                name="artist"
                onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }}
                value={formState.artist || ''}
                variant="standard"
            />

            <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <TextField
                    label="Year From"
                    margin="normal"
                    name="yearFrom"
                    onChange={handleChange}
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={formState.yearFrom || ''}
                    variant="standard"
                />
                <TextField
                    label="Year To"
                    margin="normal"
                    name="yearTo"
                    onChange={handleChange}
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={formState.yearTo || ''}
                    variant="standard"
                />
            </Stack>

            <InputLabel className={styles.ratingLabel}>Rating</InputLabel>
            <div className={styles.rating}>
                <Rating
                    max={3}
                    name="rating"
                    onChange={handleRatingChange}
                    onChangeActive={(_, newRatingHovered) => {
                        setRatingHovered(newRatingHovered);
                    }}
                    value={rating}
                />
                <span>
                    {
                        ratingLabels[
                            ratingHovered !== -1 ? ratingHovered : rating
                        ]
                    }
                </span>
            </div>

            <div className={styles.tags}>
                <TagInput
                    isEdit
                    onChange={handleTagsChange}
                    tagNames={formState.tags || []}
                />
            </div>
        </div>
    );
};
