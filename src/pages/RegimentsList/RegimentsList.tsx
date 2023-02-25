/** @jsxImportSource @emotion/react */

import { Button, Chip, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { Loading } from 'components/Loading/Loading';
import { classes } from './RegimentsList.style';

import { LoadStatus } from 'enums/loadStatus.enum';
import { RegimentTag } from 'types/RegimentTag.type';
import { useRegimentList } from './useRegimentList';

const RegimentsList = () => {
  const moduleName = `${RegimentsList.name}.tsx`;

  const {
    error,
    handleChipClick,
    handleSearchClick,
    isSearchEnabled,
    loadStatus,
    regiments,
  } = useRegimentList(moduleName);

  if (loadStatus === LoadStatus.LOADING) {
    return <Loading />;
  }
  if (loadStatus === LoadStatus.ERROR) {
    return <ErrorHandler error={error} />;
  }

  return (
    <>
      <Helmet>
        <title>Uniformology: Regiments</title>
      </Helmet>

      {regiments.length === 0 ? (
        <Typography css={classes.noItems} variant="h5">
          No Regiments available.
        </Typography>
      ) : (
        <div css={classes.container}>
          {regiments.map((regiment: RegimentTag, index: number) => (
            <Chip
              color="primary"
              label={`${regiment.name || 'Unknown'} (${regiment.count})`}
              key={index}
              onClick={() => {
                handleChipClick(index);
              }}
              variant={regiment.isSelected ? undefined : 'outlined'}
            />
          ))}
          <Button
            css={classes.button}
            disabled={!isSearchEnabled}
            onClick={handleSearchClick}
            variant="contained"
          >
            Search
          </Button>
        </div>
      )}
    </>
  );
};

export { RegimentsList };
