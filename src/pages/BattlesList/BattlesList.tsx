import { ErrorHandler } from '@components/ErrorHandler/ErrorHandler';
import { Loading } from '@components/Loading/Loading';
import { LoadStatus } from '@enums/loadStatus.enum';
import { TagCount as BattleCount } from '@models/TagCount.model';
import { Button, Chip, Typography } from '@mui/material';

import styles from './BattlesList.module.scss';
import { useBattlesList } from './useBattlesList';

export const BattlesList = () => {
    const moduleName = `${BattlesList.name}.tsx`;

    const {
        battleCounts,
        error,
        isSearchEnabled,
        loadStatus,
        showSelectedBattles,
        selectedBattleNames,
        updateSelectedBattles,
    } = useBattlesList(moduleName);

    const handleChipClick = (name: string) => {
        updateSelectedBattles(name);
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
    if (battleCounts.length === 0) {
        return (
            <Typography className={styles.noItems} variant="h5">
                No Battles available.
            </Typography>
        );
    }

    return (
        <div className={styles.container}>
            {battleCounts.map((battle: BattleCount, index: number) => (
                <Chip
                    color="primary"
                    key={index}
                    label={`${battle.name || 'Unknown'} (${battle.count})`}
                    onClick={() => {
                        handleChipClick(battle.name);
                    }}
                    variant={
                        selectedBattleNames.has(battle.name)
                            ? undefined
                            : 'outlined'
                    }
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
    );
};
