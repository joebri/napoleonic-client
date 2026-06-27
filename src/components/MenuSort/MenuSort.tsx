import SortIcon from '@mui/icons-material/Sort';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useSortFieldState } from '@state';
import { AllTagsSortOrder } from '@state/sortField.state';
import { MouseEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';

import styles from './MenuSort.module.scss';

export const MenuSort = () => {
    const location = useLocation();
    const [sortField, setSortField] = useSortFieldState();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleItemSelected = (selectedSortField: string) => {
        setSortField((currentState) => {
            if (currentState.sort === selectedSortField) {
                return currentState;
            }
            return {
                ...currentState,
                sort: selectedSortField,
            };
        });
        setAnchorEl(null);
    };

    const handleAllTagsItemSelected = (selectedSortField: AllTagsSortOrder) => {
        setSortField((currentState) => {
            if (currentState.allTagsSort === selectedSortField) {
                return currentState;
            }
            return {
                ...currentState,
                allTagsSort: selectedSortField,
            };
        });
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                aria-controls={open ? 'basic-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                color="inherit"
                onClick={handleClick}
                size="small"
            >
                <SortIcon className={styles.icon} />
                Sort
            </IconButton>

            {location.pathname === '/allTags' ? (
                <Menu
                    anchorEl={anchorEl}
                    id="basic-menu"
                    onClose={handleClose}
                    open={open}
                    slotProps={{
                        list: {
                            'aria-labelledby': 'basic-button',
                        },
                    }}
                >
                    <MenuItem
                        onClick={() =>
                            handleAllTagsItemSelected(AllTagsSortOrder.Name)
                        }
                        selected={
                            sortField.allTagsSort === AllTagsSortOrder.Name
                        }
                    >
                        Tag Name
                    </MenuItem>
                    <MenuItem
                        onClick={() =>
                            handleAllTagsItemSelected(AllTagsSortOrder.Count)
                        }
                        selected={
                            sortField.allTagsSort === AllTagsSortOrder.Count
                        }
                    >
                        Tag Count
                    </MenuItem>
                </Menu>
            ) : (
                <Menu
                    anchorEl={anchorEl}
                    id="basic-menu"
                    onClose={handleClose}
                    open={open}
                    slotProps={{
                        list: {
                            'aria-labelledby': 'basic-button',
                        },
                    }}
                >
                    <MenuItem
                        onClick={() => handleItemSelected('title')}
                        selected={sortField.sort === 'title'}
                    >
                        Title
                    </MenuItem>
                    <MenuItem
                        onClick={() => handleItemSelected('image')}
                        selected={sortField.sort === 'image'}
                    >
                        Image
                    </MenuItem>
                </Menu>
            )}
        </>
    );
};
