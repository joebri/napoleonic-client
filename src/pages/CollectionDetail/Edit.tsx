/** @jsxImportSource @emotion/react */

import { ChangeEvent, KeyboardEvent } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import {
  BackspaceOutlined as BackspaceOutlinedIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

import { classes } from './CollectionDetail.style';
import { TagInput } from '../../components/TagInput/TagInput';
import { Item } from '../../types';

interface EditProps {
  item: Item;
  onCancel: Function;
  onChange: Function;
  onSave: Function;
}

const Edit = ({ item, onCancel, onChange, onSave }: EditProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.name, event.target.value);
  };

  const handleTagsChange = (tags: string[]) => {
    onChange('tags', tags);
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
        label="Short description"
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
      <div css={classes.tags}>
        <TagInput isEdit onChange={handleTagsChange} tagNames={item.tags} />
      </div>
    </div>
  );
};

export { Edit };
