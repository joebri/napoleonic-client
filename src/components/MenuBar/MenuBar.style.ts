import { createStyles } from 'utilities/createStyles';

const classes = createStyles({
  appbar: {
    position: 'relative',
    '& > .MuiToolbar-root': {
      justifyContent: 'space-between',
      position: 'relative',
    },
  },
  appbar__left: {
    alignItems: 'center',
  },
  chip: {
    color: 'white',
    marginLeft: '1rem',
  },
  icon: {
    marginRight: '0.25rem',
  },
});

export { classes };
