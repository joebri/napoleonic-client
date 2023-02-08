import { theme } from 'theme';
import { css } from '@emotion/react';

const subContainer = css({
  border: 'solid 2px #BFBFBF',
  borderRadius: '0.25rem',
  padding: '0.5rem',
});

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
  subContainerTop: () => css`
    ${subContainer};
    padding-top: 0;
  `,
  subContainerBottom: css`
    ${subContainer};
    display: flex;
    gap: 1rem;
    margin-top: 0.25rem;
  `,
  section: css({
    marginTop: theme.spacing(1.25),
  }),
  tagGroup: css({
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '0.25rem',
  }),
  slider_container: css({
    width: '95%',
  }),
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
