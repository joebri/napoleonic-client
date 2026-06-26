import { Tag } from '@models/Tag.model';
import { Autocomplete, Chip, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useTagsStateGet } from '@state';
import { SyntheticEvent } from 'react';

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
            <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
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
            renderValue={(value: readonly string[], getTagProps: any) =>
                value.map((option: string, index: number) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return (
                        <Chip
                            key={key}
                            label={option}
                            variant="outlined"
                            {...tagProps}
                        />
                    );
                })
            }
            renderInput={(params) => (
                <TextField {...params} placeholder="Tags" />
            )}
            onChange={handleChange}
        />
    );
};
