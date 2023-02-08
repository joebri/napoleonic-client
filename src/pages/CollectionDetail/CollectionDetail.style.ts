import { createStyles } from 'utilities/createStyles';

const classes = createStyles({
  container: {
    margin: '0.5rem auto 2rem auto',
    width: '80%',
  },
  container__link: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: '2rem',
  },
  container__image: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
    marginTop: '2rem',
  },
  tags: {
    marginTop: '1rem',
  },
  actionBar: {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    right: '2rem',
    top: '5rem',
  },
  button_spacer: {
    marginBottom: '1rem',
  },
  button_spacer_x4: {
    marginBottom: '4rem',
  },
  dialog: {
    '& .MuiPaper-root': {
      width: '20vw',
    },
  },
  messageAlert: {
    width: '100%',
  },
});

export { classes };
