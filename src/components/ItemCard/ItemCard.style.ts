import { createStyles } from 'utilities/createStyles';

const classes = createStyles({
  card: {
    marginLeft: '0.5rem',
    marginTop: '1rem',
    maxWidth: '15rem',
    minWidth: '15rem',
  },
  artist: {
    fontStyle: 'italic',
    textAlign: 'right',
  },
  container_image: {
    marginBottom: '1rem',
    width: 'fit-content',
    '& img': {
      width: '100%',
    },
  },
  loading_container: {
    height: '10.75rem',
  },
  image: {
    boxShadow: '0.25rem 0.25rem 5px #ccc',
    cursor: 'url("zoomin.png"), progress',
    maxWidth: '100%',
  },
  imageFull: {
    maxHeight: 'calc(100vh - 64px)',
  },
  tagRatingLine: {
    display: 'flex',
    alignItems: 'center',
    '& > p': {
      display: 'flex',
    },
  },
  url_icon_button: {
    top: '-2px',
  },
});

export { classes };
