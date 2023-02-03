/** @jsxImportSource @emotion/react */

import { MouseEvent, useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';

import { classes } from './SortMenu.style';

import { useSortFieldState } from 'state';

const SortMenu = () => {
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
    setSortField(selectedSortField);
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
        <SortIcon css={classes.icon} />
        Sort
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="basic-menu"
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        open={open}
      >
        <MenuItem
          onClick={() => handleItemSelected('title')}
          selected={sortField === 'title'}
        >
          Title
        </MenuItem>
        <MenuItem
          onClick={() => handleItemSelected('image')}
          selected={sortField === 'image'}
        >
          Image
        </MenuItem>
      </Menu>
    </>
  );
};

export { SortMenu };
