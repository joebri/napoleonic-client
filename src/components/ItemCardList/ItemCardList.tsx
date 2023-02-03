/** @jsxImportSource @emotion/react */

import Typography from '@mui/material/Typography';

import { ItemCard } from 'components/ItemCard/ItemCard';
import { classes } from './ItemCardList.style';

import { useTagsStateGet } from 'state';
import { Item, Tag } from '../../types';

interface ItemCardListProps {
  items: Item[];
}

const ItemCardList = ({ items }: ItemCardListProps) => {
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
      <Typography css={classes.noItems} variant="h5">
        No Items available.
      </Typography>
    );
  }

  return (
    <Typography css={classes.noItems} variant="h5">
      Welcome to Uniformology!
    </Typography>
  );
};

export { ItemCardList };
export type { ItemCardListProps };
