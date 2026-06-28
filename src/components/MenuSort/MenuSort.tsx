import SortIcon from '@mui/icons-material/Sort';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useSortFieldState } from '@state';
import { ItemTagsSortOrder, TagsSortOrder } from '@state/sortField.state';
import { MouseEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';

import styles from './MenuSort.module.scss';

const PATH_KEY_MAP: Record<
    string,
    'allTagsSort' | 'artistTagsSort' | 'battleTagsSort' | 'regimentTagsSort'
> = {
    '/allTags': 'allTagsSort',
    '/artists': 'artistTagsSort',
    '/battles': 'battleTagsSort',
    '/regiments': 'regimentTagsSort',
};

export const MenuSort = () => {
    const { pathname } = useLocation();
    const [sortField, setSortField] = useSortFieldState();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const tagStateKey = PATH_KEY_MAP[pathname];
    const isTagRoute = Boolean(tagStateKey);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) =>
        setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    const handleItemSelected = (selectedSortField: ItemTagsSortOrder) => {
        setSortField((current) =>
            current.itemTagsSort === selectedSortField
                ? current
                : { ...current, itemTagsSort: selectedSortField }
        );
        handleClose();
    };

    const handleTagItemSelected = (selectedSortField: TagsSortOrder) => {
        if (tagStateKey) {
            setSortField((current) =>
                current[tagStateKey] === selectedSortField
                    ? current
                    : { ...current, [tagStateKey]: selectedSortField }
            );
        }
        handleClose();
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
                <SortIcon className={styles.icon} /> Sort
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                id="basic-menu"
                onClose={handleClose}
                open={open}
                slotProps={{ list: { 'aria-labelledby': 'basic-button' } }}
            >
                {isTagRoute ? (
                    <>
                        <MenuItem
                            onClick={() =>
                                handleTagItemSelected(TagsSortOrder.Name)
                            }
                            selected={
                                sortField[tagStateKey!] === TagsSortOrder.Name
                            }
                        >
                            Tag Name
                        </MenuItem>
                        <MenuItem
                            onClick={() =>
                                handleTagItemSelected(TagsSortOrder.Count)
                            }
                            selected={
                                sortField[tagStateKey!] === TagsSortOrder.Count
                            }
                        >
                            Tag Count
                        </MenuItem>
                    </>
                ) : (
                    <>
                        <MenuItem
                            onClick={() =>
                                handleItemSelected(ItemTagsSortOrder.Title)
                            }
                            selected={
                                sortField.itemTagsSort ===
                                ItemTagsSortOrder.Title
                            }
                        >
                            Title
                        </MenuItem>
                        <MenuItem
                            onClick={() =>
                                handleItemSelected(ItemTagsSortOrder.Image)
                            }
                            selected={
                                sortField.itemTagsSort ===
                                ItemTagsSortOrder.Image
                            }
                        >
                            Image
                        </MenuItem>
                    </>
                )}
            </Menu>
        </>
    );
};
