/** @jsxImportSource @emotion/react */

import { useAuth0 } from '@auth0/auth0-react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CollectionsIcon from '@mui/icons-material/Collections';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { classes } from './MenuMain.style';

const MenuMain = () => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout } = useAuth0();

  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGalleryClick = () => {
    setAnchorEl(null);
    navigate(`/gallery`);
  };

  const handleAddItemClick = () => {
    setAnchorEl(null);
    navigate(`/itemDetailAdd`);
  };

  const handleAddCollectionClick = () => {
    setAnchorEl(null);
    navigate(`/collectionDetailAdd`);
  };

  const handleSettingsClick = () => {
    setAnchorEl(null);
    navigate(`/settings`);
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: process.env.REACT_APP_AUTH0_LOGIN } });
  };

  return (
    <>
      <IconButton
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        color="inherit"
        onClick={handleClick}
        size="small"
      >
        <MenuIcon css={classes.icon} />
        Menu
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleGalleryClick}>
          <CollectionsIcon css={classes.icon} />
          Gallery
        </MenuItem>
        <MenuItem onClick={handleAddItemClick}>
          <AddPhotoAlternateIcon css={classes.icon} />
          Add Item
        </MenuItem>
        <MenuItem onClick={handleAddCollectionClick}>
          <PostAddIcon css={classes.icon} />
          Add Collection
        </MenuItem>
        <MenuItem onClick={handleSettingsClick}>
          <SettingsOutlinedIcon css={classes.icon} />
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon css={classes.icon} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export { MenuMain };
