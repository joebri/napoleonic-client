/** @jsxImportSource @emotion/react */

import { ChangeEvent, KeyboardEvent, useState } from 'react';
import {
  Button,
  FormControlLabel,
  InputLabel,
  RadioGroup,
  Radio,
  Stack,
  TextField,
} from '@mui/material';
import {
  BackspaceOutlined as BackspaceOutlinedIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

import { classes } from './ItemDetail.style';
import { TagInput } from 'components/TagInput/TagInput';

import { Item } from 'types';

interface EditProps {
  item: Item;
  onCancel: Function;
  onChange: Function;
  onSave: Function;
}

const Edit = ({ item, onCancel, onChange, onSave }: EditProps) => {
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.name, event.target.value);
    setIsDirty(true);
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
          css={classes.button__spacer}
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

      <InputLabel css={classes.radioLabel}>Rating</InputLabel>
      <RadioGroup name="rating" row onChange={handleChange} value={item.rating}>
        <FormControlLabel value="1" control={<Radio />} label="High" />
        <FormControlLabel value="3" control={<Radio />} label="Medium" />
        <FormControlLabel value="5" control={<Radio />} label="Low" />
      </RadioGroup>

      <div css={classes.tags}>
        <TagInput isEdit onChange={handleTagsChange} tagNames={item.tags} />
      </div>
    </div>
  );
};

export { Edit };
