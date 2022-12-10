import { css } from '@emotion/react';

const classes = {
  container: css({
    margin: '0.5rem auto',
    width: '80%',
  }),
  container_image: css({
    marginBottom: '1rem',
    width: 'fit-content',
  }),
  image: css({
    boxShadow: '0.25rem 0.25rem 5px #ccc',
    maxWidth: '100%',
  }),
  artist: css({
    fontStyle: 'italic',
    textAlign: 'right',
  }),
  tags: css({
    marginTop: '1rem',
  }),
  actionBar: css({
    marginTop: '2rem',
  }),
  edit: css({
    marginRight: '1rem',
  }),
  save: css({
    marginRight: '1rem',
  }),
  dialog: css({
    '& .MuiPaper-root': {
      width: '20vw',
    },
  }),
  messageAlert: css({
    width: '100%',
  }),
};

export { classes };
