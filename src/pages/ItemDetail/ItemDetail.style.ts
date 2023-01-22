import { createStyles } from 'createStyles';

const classes = createStyles({
  container: {
    margin: '0.5rem auto 2rem auto',
    width: '80%',
    '& .MuiAutocomplete-root': {
      width: '100%',
    },
  },
  container_image: {
    marginBottom: '1rem',
    marginTop: '1rem',
    width: 'fit-content',
  },
  image: {
    boxShadow: '0.25rem 0.25rem 5px #ccc',
    maxWidth: '100%',
  },
  artist: {
    fontStyle: 'italic',
    textAlign: 'right',
  },

  ratingLabel: {
    fontSize: '0.8rem',
    marginBottom: '0.3rem',
    marginTop: '1rem',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    '& > span:nth-of-type(1)': {
      top: '-1px',
    },
    '& > span:nth-of-type(2)': {
      marginLeft: '1rem',
    },
  },
  tags: {
    alignItems: 'center',
    display: 'flex',
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
