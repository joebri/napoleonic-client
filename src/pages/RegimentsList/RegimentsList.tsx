import { Button, Chip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { ErrorHandler } from 'components/ErrorHandler/ErrorHandler';
import { Loading } from 'components/Loading/Loading';

import { LoadStatus } from 'enums/loadStatus.enum';
import { RegimentTag } from 'types/RegimentTag.type';

import styles from './RegimentsList.module.scss';
import { useRegimentList } from './useRegimentList';

const RegimentsList = () => {
    const moduleName = `${RegimentsList.name}.tsx`;
    const navigate = useNavigate();

    const {
        error,
        getSelectedRegiments,
        isSearchEnabled,
        loadStatus,
        regiments,
        updateSelectedRegiments,
    } = useRegimentList(moduleName);

    const handleChipClick = (index: number) => {
        updateSelectedRegiments(index);
    };

    const handleSearchClick = () => {
        const selected = getSelectedRegiments();
        navigate(`/gallery?regiments=${selected.join('||')}`);
    };

    if (loadStatus === LoadStatus.LOADING) {
        return <Loading />;
    }
    if (loadStatus === LoadStatus.ERROR) {
        return <ErrorHandler error={error} />;
    }
    if (regiments.length === 0) {
        return (
            <Typography className={styles.noItems} variant="h5">
                No Regiments available.
            </Typography>
        );
    }

    return (
        <div className={styles.container}>
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

export { RegimentsList };
