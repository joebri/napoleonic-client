/** @jsxImportSource @emotion/react */

import { MouseEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Image } from 'cloudinary-react';

import { classes } from './ItemCard.style';
import { TagTooltip } from 'components/TagTooltip/TagTooltip';

import { imageService, imageAccountName } from 'services/imageService';
import { Item, Tag } from 'types';
import { useAppContext } from 'AppContext';

interface ItemCardProps {
  item: Item;
}

const parseDescriptionForImage = (descriptionLong: string): string => {
  const match = descriptionLong.match(/<img src="([\w\W]+?)["][ ]?\/>/i);
  const url = match ? match[1] : '';
  return url;
};

const ItemCard = ({ item }: ItemCardProps) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [nationalityTags, setNationalityTags] = useState('');
  const [alternateImageUrl, setAlternateImageUrl] = useState('');

  const { tags: availableTags } = useAppContext();

  useEffect(() => {
    const nationTags = availableTags
      .filter((tag: Tag) => {
        return tag.group === 'Nation';
      })
      .map((tag: Tag) => tag.name);

    const tags = item.tags.filter((tag) => nationTags.includes(tag)).join(', ');
    setNationalityTags(tags);

    if (!item.publicId) {
      const url = parseDescriptionForImage(item.descriptionLong);
      if (url) {
        setAlternateImageUrl(url);
      }
    }
  }, [availableTags, item]);

  const open = Boolean(anchorEl);

  const handleMenuClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewMenuClick = () => {
    navigate(`/itemDetailView/${item.id}`);
    setAnchorEl(null);
  };

  const handleEditMenuClick = () => {
    navigate(`/itemDetailEdit/${item.id}`);
    setAnchorEl(null);
  };

  const handleImageClick = () => {
    setIsOpen(true);
  };

  const handleImageClose = () => {
    setIsOpen(false);
  };

  const getUrl = (imagePublicId: string) => {
    const url = imageService
      .image(`${imagePublicId}`)
      .quality('auto')
      .format('auto')
      .toURL();
    return url;
  };

  return (
    <>
      <Card css={classes.card} data-itemid={item.id}>
        <CardHeader
          title={item.title}
          subheader={item.descriptionShort}
          action={
            <IconButton aria-label="settings" onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          }
        ></CardHeader>

        <CardContent>
          {item.publicId ? (
            <div css={[classes.container_image]}>
              <Image
                css={classes.image}
                cloudName={imageAccountName}
                onClick={handleImageClick}
                publicId={getUrl(item.publicId)}
                secure="true"
                title={item.publicId}
              />
              {item.artist && (
                <>
                  <Typography
                    css={[classes.artist]}
                    variant="body2"
                    color="text.secondary"
                  >
                    {item.artist}
                  </Typography>
                </>
              )}
            </div>
          ) : (
            <>
              {alternateImageUrl && (
                <div css={[classes.container_image]}>
                  <Image src={alternateImageUrl} />
                  {item.artist && (
                    <>
                      <Typography
                        css={[classes.artist]}
                        variant="body2"
                        color="text.secondary"
                      >
                        {item.artist}
                      </Typography>
                    </>
                  )}
                </div>
              )}
            </>
          )}

          <Typography variant="body2" color="text.secondary">
            Nationality: {nationalityTags}
          </Typography>

          {item.regiments && (
            <Typography variant="body2" color="text.secondary">
              Regiment(s): {item.regiments}
            </Typography>
          )}

          {(item.yearFrom || item.yearTo) && (
            <Typography variant="body2" color="text.secondary">
              Year: {item.yearFrom}
              {item.yearTo ? <span> - {item.yearTo}</span> : ''}
            </Typography>
          )}

          <Typography variant="body2" color="text.secondary">
            <TagTooltip tagNames={item.tags} />
          </Typography>
        </CardContent>
      </Card>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleViewMenuClick}>View</MenuItem>
        <MenuItem onClick={handleEditMenuClick}>Edit</MenuItem>
      </Menu>

      <Dialog onClose={handleImageClose} open={isOpen}>
        <Image
          cloudName={imageAccountName}
          css={classes.imageFull}
          publicId={getUrl(item.publicId)}
          secure="true"
        />
      </Dialog>
    </>
  );
};

export { ItemCard };
