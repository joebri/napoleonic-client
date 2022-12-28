import { css } from '@emotion/react';

const classes = {
  container: css({
    margin: '0.5rem auto 2rem auto',
    width: '80%',
  }),
  container_image: css({
    marginBottom: '1rem',
    marginTop: '1rem',
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
  radioLabel: css({
    fontSize: '0.8rem',
    marginTop: '1rem',
  }),
  actionBar: css({
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    right: '2rem',
    top: '5rem',
  }),
  button__spacer: css({
    marginBottom: '1rem',
  }),
  button__spacer__x4: css({
    marginBottom: '4rem',
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
