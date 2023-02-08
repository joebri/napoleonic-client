/** @jsxImportSource @emotion/react */

import { Chip, Stack, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { SyntheticEvent } from 'react';

import { useTagsStateGet } from 'state';
import { Tag } from 'types';

interface TagInputProps {
  tagNames: string[];
  isEdit: boolean;
  onChange?: Function;
}

const TagInput = ({ tagNames, isEdit, onChange = () => {} }: TagInputProps) => {
  const availableTags = useTagsStateGet();

  const availbleTagNames = availableTags.map((tag: Tag) => {
    return tag.name;
  });

  const handleChange = (_: SyntheticEvent, value: string[]) => {
    onChange(value);
  };

  if (!isEdit) {
    return (
      <>
        <Stack direction="row" gap={1}>
          {tagNames.map((tagName: string, index: number) => (
            <Chip label={tagName} variant="outlined" key={index} />
          ))}
        </Stack>
      </>
    );
  }

  return (
    <>
      <Autocomplete
        multiple
        id="tags-filled"
        options={availbleTagNames}
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
        renderInput={(params) => <TextField {...params} placeholder="Tags" />}
        onChange={handleChange}
      />
    </>
  );
};

export { TagInput };
