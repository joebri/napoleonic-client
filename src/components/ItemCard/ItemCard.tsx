import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Menu,
    MenuItem,
    Rating,
    Typography,
} from '@mui/material';
import { MouseEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TagTooltip } from 'components/TagTooltip/TagTooltip';

import { toUiRating } from 'pages/ItemDetail/ItemDetailHelper';
import { useTagsStateGet } from 'state';
import { Item, ItemMetaData, Tag } from 'types';

import { ImageMetaData } from './ImageMetaData';
import styles from './ItemCard.module.scss';
import { ItemCardImage } from './ItemCardImage';

interface ItemCardProps {
    item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
    const navigate = useNavigate();

    const availableTags = useTagsStateGet();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [nationalityTags, setNationalityTags] = useState('');
    const [rating, setRating] = useState(0);
    const [metaData, setMetaData] = useState<ItemMetaData>({} as ItemMetaData);
    const [isShowMetaData, setIsShowMetaData] = useState(false);

    useEffect(() => {
        if (item.rating) {
            setRating(toUiRating(item.rating));
        }

        const nationTags = availableTags
            .filter((tag: Tag) => {
                return tag.group === 'Nation';
            })
            .map((tag: Tag) => tag.name);

        const tags = item.tags
            .filter((tag) => nationTags.includes(tag))
            .join(', ');
        setNationalityTags(tags);
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

    const handleMetaMenuClick = async () => {
        setAnchorEl(null);
        setIsShowMetaData(true);
    };

    const handleImageMetaDataChange = (metaData: ItemMetaData) => {
        setMetaData(metaData);
    };

    const handleImageMetaDataClose = () => {
        setIsShowMetaData(false);
    };

    return (
        <>
            <Card className={styles.card} data-itemid={item.id}>
                <CardHeader
                    title={item.title}
                    subheader={item.descriptionShort}
                    action={
                        <IconButton
                            aria-label="settings"
                            onClick={handleMenuClick}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    }
                ></CardHeader>

                <CardContent>
                    <div className={styles.containerImage}>
                        {isShowMetaData ? (
                            <ImageMetaData
                                metaData={metaData}
                                onClose={handleImageMetaDataClose}
                            />
                        ) : (
                            <ItemCardImage
                                item={item}
                                onMetaDataChange={handleImageMetaDataChange}
                            />
                        )}
                    </div>

                    <Typography color="text.secondary" variant="body2">
                        Nationality: {nationalityTags}
                    </Typography>

                    {item.regiments && (
                        <Typography color="text.secondary" variant="body2">
                            Regiment(s): {item.regiments}
                        </Typography>
                    )}

                    {(item.yearFrom || item.yearTo) && (
                        <Typography variant="body2" color="text.secondary">
                            Year: {item.yearFrom}
                            {item.yearTo ? <span> - {item.yearTo}</span> : ''}
                        </Typography>
                    )}

                    <div className={styles.tagRatingLine}>
                        <Typography variant="body2" color="text.secondary">
                            <TagTooltip tagNames={item.tags} />
                        </Typography>

                        <Rating max={3} readOnly size="small" value={rating} />
                    </div>
                </CardContent>
            </Card>

            <Menu
                anchorEl={anchorEl}
                data-testid="menu"
                id="basic-menu"
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                onClose={handleMenuClose}
                open={open}
            >
                <MenuItem onClick={handleViewMenuClick}>View</MenuItem>
                <MenuItem onClick={handleEditMenuClick}>Edit</MenuItem>
                <MenuItem onClick={handleMetaMenuClick}>MetaData</MenuItem>
            </Menu>
        </>
    );
};

export { ItemCard };
