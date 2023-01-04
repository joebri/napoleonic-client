/** @jsxImportSource @emotion/react */

import { ChangeEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { classes } from './Settings.style';
import { Template } from 'types';

import { useLocalStorage } from 'hooks/useLocalStorage';

const Settings = () => {
  const [template, setTemplate] = useLocalStorage<any>('template', {
    artist: '',
    tags: [],
    urlRoot: '',
    yearFrom: '',
  } as Template);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setTemplate((priorTemplate: Template) => ({
      ...priorTemplate,
      [field]: event.target.value,
    }));
  };

  // const handleCancelClick = () => {};

  // const handleSaveClick = () => {};

  return (
    <>
      <Helmet>
        <title>Uniformology: Settings</title>
      </Helmet>
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

        <TextField
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          label="Year From"
          margin="normal"
          onChange={(event) => handleChange(event, 'yearFrom')}
          value={template.yearFrom}
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
