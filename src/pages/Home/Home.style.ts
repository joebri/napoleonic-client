import { css } from '@emotion/react';

const classes = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  }),
  content: css({
    height: '100%',
    // overflowY: 'scroll',
    overflowY: 'auto',
    // flexDirection: 'column',
    // display: 'flex',
    // justifyContent: 'space-between',
  }),
};

export { classes };
