import BackspaceOutlinedIcon from '@mui/icons-material/Backspace';
import SaveIcon from '@mui/icons-material/Save';
import { Button, InputLabel, Rating, Stack, TextField } from '@mui/material';
import {
    ChangeEvent,
    KeyboardEvent,
    SyntheticEvent,
    useEffect,
    useState,
} from 'react';

import { TagInput } from 'components/TagInput/TagInput';

import { Item } from 'types';

import styles from './ItemDetail.module.scss';
import { ratingLabels, toItemRating, toUiRating } from './ItemDetailHelper';

interface EditProps {
    item: Item;
    onCancel: Function;
    onChange: Function;
    onSave: Function;
}

export const Edit = ({ item, onCancel, onChange, onSave }: EditProps) => {
    const [isDirty, setIsDirty] = useState(false);
    const [ratingHovered, setRatingHovered] = useState(-1);
    const [rating, setRating] = useState(2);

    useEffect(() => {
        setRating(toUiRating(item.rating));
    }, [item.rating]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.name, event.target.value);
        setIsDirty(true);
    };

    const handleTagsChange = (tags: string[]) => {
        onChange('tags', tags);
        setIsDirty(true);
    };

    const handleRatingChange = (_: SyntheticEvent, value: number | null) => {
        onChange('rating', toItemRating(value));
        setIsDirty(true);
    };

    const handleCancelClick = () => {
        onCancel();
    };

    const handleSaveClick = () => {
        onSave();
    };

    const handleOnKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.code === 'KeyS') {
            onSave();
            event.preventDefault();
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
                InputLabelProps={{
                    shrink: true,
                }}
                label="Title"
                margin="normal"
                name="title"
                onChange={handleChange}
                value={item.title}
                variant="standard"
            />
            <TextField
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                label="Subtitle"
                margin="normal"
                name="descriptionShort"
                onChange={handleChange}
                value={item.descriptionShort}
                variant="standard"
            />
            <TextField
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                label="Long description"
                margin="normal"
                multiline
                name="descriptionLong"
                onChange={handleChange}
                value={item.descriptionLong}
                variant="standard"
            />
            <TextField
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                label="Regiment(s)"
                margin="normal"
                name="regiments"
                onChange={handleChange}
                value={item.regiments}
                variant="standard"
            />
            <TextField
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                label="Image url"
                margin="normal"
                name="publicId"
                onChange={handleChange}
                value={item.publicId}
                variant="standard"
            />
            <TextField
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                label="Artist"
                margin="normal"
                name="artist"
                onChange={handleChange}
                value={item.artist}
                variant="standard"
            />
            <Stack direction={'row'} gap={2}>
                <TextField
                    InputLabelProps={{
                        shrink: true,
                    }}
                    label="Year From"
                    margin="normal"
                    name="yearFrom"
                    onChange={handleChange}
                    value={item.yearFrom}
                    variant="standard"
                />
                <TextField
                    InputLabelProps={{
                        shrink: true,
                    }}
                    label="Year To"
                    margin="normal"
                    name="yearTo"
                    onChange={handleChange}
                    value={item.yearTo}
                    variant="standard"
                />
            </Stack>

            <InputLabel className={styles.ratingLabel}>Rating</InputLabel>
            <div className={styles.rating}>
                <Rating
                    defaultValue={2}
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
                    tagNames={item.tags}
                />
            </div>
        </div>
    );
};
