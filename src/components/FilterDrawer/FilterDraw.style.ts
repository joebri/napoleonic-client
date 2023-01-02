import { css } from '@emotion/react';
import { theme } from '../../theme';

const classes = {
  filters: css({
    '& > .MuiDrawer-paper': {
      width: '33%',
    },
  }),
  container: css({
    padding: theme.spacing(1),
    '& .MuiChip-root': {},
  }),
  subcontainer: {
    border: 'solid 1px #bfbfbf',
    borderRadius: '0.25rem',
    padding: '0.5rem',
  },
  section: css({
    marginTop: theme.spacing(1),
  }),
  tagGroup: css({
    flexWrap: 'wrap',
  }),
  slider_container: {
    width: '95%',
  },
  years: css({
    fontSize: '1rem',
    margin: '0.4rem 0.5rem 0',
  }),
  years_checkbox: css({
    marginLeft: '1rem',
    top: '-0.3rem',
    position: 'relative',
  }),
};

export { classes };
