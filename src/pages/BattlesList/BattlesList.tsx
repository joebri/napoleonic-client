import { Button, Chip, Typography } from '@mui/material';

import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { Loading } from 'components/Loading/Loading';

import { LoadStatus } from 'enums/loadStatus.enum';
import { BattleTag } from 'types';

import styles from './BattlesList.module.scss';
import { useBattlesList } from './useBattlesList';

const BattlesList = () => {
    const moduleName = `${BattlesList.name}.tsx`;

    const {
        battles,
        error,
        isSearchEnabled,
        loadStatus,
        showSelectedBattles,
        updateSelectedBattles,
    } = useBattlesList(moduleName);

    const handleChipClick = (index: number) => {
        updateSelectedBattles(index);
    };

    const handleSearchClick = () => {
        showSelectedBattles();
    };

    if (loadStatus === LoadStatus.LOADING) {
        return <Loading />;
    }
    if (loadStatus === LoadStatus.ERROR) {
        return <ErrorHandler error={error} />;
    }

    return (
        <>
            {battles.length === 0 ? (
                <Typography className={styles.noItems} variant="h5">
                    No Battles available.
                </Typography>
            ) : (
                <div className={styles.container}>
                    {battles.map((battle: BattleTag, index: number) => (
                        <Chip
                            color="primary"
                            label={`${battle.name || 'Unknown'} (${
                                battle.count
                            })`}
                            key={index}
                            onClick={() => {
                                handleChipClick(index);
                            }}
                            variant={battle.isSelected ? undefined : 'outlined'}
                        />
                    ))}
                    <Button
                        aria-label="search"
                        className={styles.button}
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

export { BattlesList };
