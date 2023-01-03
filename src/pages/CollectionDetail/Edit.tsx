/** @jsxImportSource @emotion/react */

import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { Button, TextField } from '@mui/material';
import {
  BackspaceOutlined as BackspaceOutlinedIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

import { classes } from './CollectionDetail.style';
import { Collection } from 'types';
import { TagInput } from 'components/TagInput/TagInput';

interface EditProps {
  collection: Collection;
  onCancel: Function;
  onChange: Function;
  onSave: Function;
}

const Edit = ({ collection, onCancel, onChange, onSave }: EditProps) => {
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.name, event.target.value);
    setIsDirty(true);
  };

  const handleTagsChange = (tags: string[]) => {
    onChange('tags', tags);
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
      <div css={classes.actionBar}>
        <Button
          css={classes.button_spacer}
          disabled={!isDirty}
          onClick={handleSaveClick}
          size="small"
          startIcon={<SaveIcon />}
          variant="contained"
        >
          Save
        </Button>
        <Button
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
        label="Tag Name"
        margin="normal"
        name="tagName"
        onChange={handleChange}
        value={collection.tagName}
        variant="standard"
      />
      <TextField
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        label="Title"
        margin="normal"
        name="title"
        onChange={handleChange}
        value={collection.title}
        variant="standard"
      />
      <TextField
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        label="Short description"
        margin="normal"
        name="descriptionShort"
        onChange={handleChange}
        value={collection.descriptionShort}
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
        value={collection.descriptionLong}
        variant="standard"
      />
      {/* <div css={classes.tags}>
        <TagInput
          isEdit
          onChange={handleTagsChange}
          tagNames={collection.tags}
        />
      </div> */}
    </div>
  );
};

export { Edit };
