import { css } from '@emotion/react';

const classes = {
  appbar: css({
    position: 'relative',
    '& > .MuiToolbar-root': {
      justifyContent: 'space-between',
      position: 'relative',
    },
  }),
  appbar__left: css({}),
  chip: css({
    color: 'white',
    marginLeft: '1rem',
  }),
  icon: css({
    marginRight: '0.25rem',
  }),
};

export { classes };
