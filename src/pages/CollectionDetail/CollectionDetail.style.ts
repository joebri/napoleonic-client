import { css } from '@emotion/react';

const classes = {
  container: css({
    margin: '0.5rem auto 2rem auto',
    width: '80%',
  }),
  container__link: css({
    display: 'flex',
    justifyContent: 'center',
    fontSize: '2rem',
  }),
  container__image: css({
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
    marginTop: '2rem',
  }),
  tags: css({
    marginTop: '1rem',
  }),
  actionBar: css({
    position: 'fixed',
    right: '2rem',
    top: '5rem',
  }),
  button_spacer: css({
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
