import { createStyles } from 'utilities/createStyles';

const classes = createStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  content: {
    height: '100%',
    // overflowY: 'scroll',
    overflowY: 'auto',
    // flexDirection: 'column',
    // display: 'flex',
    // justifyContent: 'space-between',
  },
});

export { classes };
