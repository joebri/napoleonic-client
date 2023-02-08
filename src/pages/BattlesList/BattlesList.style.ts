import { createStyles } from 'utilities/createStyles';

const classes = createStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    margin: '2rem auto 2rem auto',
    width: '85%',
  },
  noItems: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    alignItems: 'center',
    display: 'flex',
    margin: '1rem 0 0.5rem 0',
    whiteSpace: 'break-spaces',
  },
  button: {
    flexDirection: 'column',
    position: 'fixed',
    right: '2rem',
    top: '5rem',
  },
});

export { classes };
