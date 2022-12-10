import { css } from '@emotion/react';

const classes = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  }),
  appbar: css({
    '& > .MuiToolbar-root': {
      position: 'relative',
      justifyContent: 'space-between',
    },
  }),
  appbar__left: css({}),
  content: css({
    height: '100%',
    // overflowY: 'scroll',

    overflowY: 'auto',

    // flexDirection: 'column',
    // display: 'flex',
    // justifyContent: 'space-between',
  }),
  chip: css({
    marginLeft: '1rem',
    color: 'white',
  }),
  icon: css({
    marginRight: '0.25rem',
  }),
};

export { classes };
