import { css } from '@emotion/react';
// import { theme } from '../theme';

const classes = {
  card: css({
    marginLeft: '0.5rem',
    marginTop: '1rem',
    maxWidth: '15rem',
    minWidth: '15rem',
  }),
  noItems: css({
    margin: 'auto',
  }),
  artist: css({
    fontStyle: 'italic',
    textAlign: 'right',
  }),
  container_image: css({
    marginBottom: '1rem',
    width: 'fit-content',
  }),
  image: css({
    boxShadow: '0.25rem 0.25rem 5px #ccc',
    cursor: 'pointer',
    maxWidth: '100%',
  }),
  imageFull: css({
    maxHeight: 'calc(100vh - 64px)',
  }),
};

export { classes };
