import { Typography } from '@mui/material';

import { ItemCard } from 'components/ItemCard/ItemCard';

import { useTagsStateGet } from 'state';

import { Item, Tag } from '../../types';
import styles from './ItemCardList.module.scss';

export type ItemCardListProps = {
    items: Item[];
};

export const ItemCardList = ({ items }: ItemCardListProps) => {
    const tags = useTagsStateGet();

    if (items?.length > 0) {
        return (
            <>
                {items.map((item: Item) => (
                    <ItemCard key={item.id.toString()} item={item}></ItemCard>
                ))}
            </>
        );
    }

    const isAnyTagSelected = tags.some((tag: Tag) => tag.isSelected);
    if (isAnyTagSelected) {
        return (
            <Typography className={styles.noItems} variant="h5">
                No Items available.
            </Typography>
        );
    }

    return (
        <Typography className={styles.noItems} variant="h2">
            Welcome to Napoleonic Uniformology!
        </Typography>
    );
};
