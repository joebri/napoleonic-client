import { createStyles } from 'createStyles';

const classes = createStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    height: 'fit-content',
    marginBottom: '1rem',
  },

  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },

  // TODO JSB rework this
  div1: {
    flex: '1',
    overflowY: 'auto',

    flexWrap: 'wrap',
    display: 'flex',
    flexDirection: 'row',
  },

  pager: {
    padding: '0.5rem 0 0.25rem 0',
    'ul.MuiPagination-ul': {
      justifyContent: 'center',
    },
  },
  pageNumber: {
    padding: '0.5rem 0 0.25rem 0',
    width: '4rem',
    '& .MuiInputBase-input': {
      padding: '4px 4px 5px 4px',
    },
  },
});

export { classes };
