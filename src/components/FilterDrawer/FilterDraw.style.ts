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
  // header: css({
  //   display: 'flex',
  //   justifyContent: 'space-between',
  // }),
  section: css({
    marginTop: theme.spacing(1),
  }),
  tagGroup: css({
    flexWrap: 'wrap',
  }),
};

export { classes };
