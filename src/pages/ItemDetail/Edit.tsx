/** @jsxImportSource @emotion/react */

import { ChangeEvent } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import {
  BackspaceOutlined as BackspaceOutlinedIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

import { classes } from './ItemDetail.style';
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

  return (
    <div css={classes.container}>
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
        name="artist-name"
        onChange={handleChange}
        value={item.artist?.name}
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

      <div css={classes.tags}>
        <TagInput isEdit onChange={handleTagsChange} tagNames={item.tags} />
      </div>

      <div css={classes.actionBar}>
        <Stack direction="row" gap={1}>
          <Button
            onClick={handleCancelClick}
            size="small"
            startIcon={<BackspaceOutlinedIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveClick}
            size="small"
            startIcon={<SaveIcon />}
            variant="contained"
          >
            Save
          </Button>
        </Stack>
      </div>
    </div>
  );
};

export { Edit };
