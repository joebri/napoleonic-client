import { createStyles } from 'utilities/createStyles';
import { theme } from '../../theme';

const classes = createStyles({
  filters: {
    '& > .MuiDrawer-paper': {
      width: '33%',
    },
  },
  container: {
    padding: theme.spacing(1),
    '& .MuiChip-root': {},
  },
  subcontainer: {
    border: 'solid 1px #bfbfbf',
    borderRadius: '0.25rem',
    padding: '0.5rem',
  },
  section: {
    marginTop: theme.spacing(1),
  },
  tagGroup: {
    flexWrap: 'wrap',
  },
  slider_container: {
    width: '95%',
  },
  years: {
    fontSize: '1rem',
    margin: '0.4rem 0.5rem 0',
  },
  years_checkbox: {
    marginLeft: '1rem',
    top: '-0.3rem',
    position: 'relative',
  },
});

export { classes };
