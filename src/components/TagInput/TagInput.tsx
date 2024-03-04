import { Autocomplete, Chip, Stack, TextField } from '@mui/material';
import { SyntheticEvent } from 'react';

import { useTagsStateGet } from 'state';
import { Tag } from 'types';

type TagInputProps = {
    tagNames: string[];
    isEdit: boolean;
    onChange?: Function;
};

export const TagInput = ({
    tagNames,
    isEdit,
    onChange = () => {},
}: TagInputProps) => {
    const availableTags = useTagsStateGet();

    const availableTagNames = availableTags.map((tag: Tag) => {
        return tag.name;
    });

    const handleChange = (_: SyntheticEvent, value: string[]) => {
        onChange(value);
    };

    if (!isEdit) {
        return (
            <Stack direction="row" gap={1}>
                {tagNames.map((tagName: string, index: number) => (
                    <Chip label={tagName} variant="outlined" key={index} />
                ))}
            </Stack>
        );
    }

    return (
        <Autocomplete
            multiple
            id="tags-filled"
            options={availableTagNames}
            value={tagNames}
            freeSolo
            renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                    <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                    />
                ))
            }
            renderInput={(params) => (
                <TextField {...params} placeholder="Tags" />
            )}
            onChange={handleChange}
        />
    );
};
