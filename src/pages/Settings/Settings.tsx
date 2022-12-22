/** @jsxImportSource @emotion/react */

// import { useContext } from 'react';
import { Button, Stack, TextField, Typography } from '@mui/material';
// import {
//   BackspaceOutlined as BackspaceOutlinedIcon,
//   Save as SaveIcon,
// } from '@mui/icons-material';

import { classes } from './Settings.style';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const Settings = () => {
  const [template, setTemplate] = useLocalStorage<any>('template', {
    artist: '',
    tags: [],
    urlRoot: '',
  });

  const handleChange = (event: any, field: string) => {
    setTemplate((priorTemplate: any) => ({
      ...priorTemplate,
      [field]: event.target.value,
    }));
  };

  // const handleCancelClick = () => {};

  // const handleSaveClick = () => {};

  return (
    <>
      <div css={classes.container}>
        <Typography variant="h5">Templates</Typography>
        <TextField
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          label="Image url"
          margin="normal"
          onChange={(event) => handleChange(event, 'urlRoot')}
          value={template.urlRoot}
          variant="standard"
        />
        <TextField
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          label="Tags"
          margin="normal"
          onChange={(event) => handleChange(event, 'tags')}
          value={template.tags}
          variant="standard"
        />
        <TextField
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          label="Artist"
          margin="normal"
          onChange={(event) => handleChange(event, 'artist')}
          value={template.artist}
          variant="standard"
        />

        {/* <div css={classes.actionBar}>
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
        </div> */}
      </div>
    </>
  );
};

export { Settings };
