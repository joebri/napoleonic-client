import { css } from '@emotion/react';

const classes = {
  container: css({
    margin: '0.5rem auto 2rem auto',
    width: '80%',
    '& .MuiAutocomplete-root': {
      width: '100%',
    },
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

  ratingLabel: css({
    fontSize: '0.8rem',
    marginBottom: '0.3rem',
    marginTop: '1rem',
  }),
  rating: css({
    display: 'flex',
    alignItems: 'center',
    '& > span:nth-of-type(1)': {
      top: '-1px',
    },
    '& > span:nth-of-type(2)': {
      marginLeft: '1rem',
    },
  }),
  tags: css({
    alignItems: 'center',
    display: 'flex',
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
  button__spacerx4: css({
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
