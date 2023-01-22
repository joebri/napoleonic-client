/** @jsxImportSource @emotion/react */

import { classes } from './ItemCardList.style';
import { ItemCard } from 'components/ItemCard/ItemCard';

import { Item } from '../../types';
import Typography from '@mui/material/Typography';

interface ItemCardListProps {
  items: Item[];
}

const ItemCardList = ({ items }: ItemCardListProps) => {
  return (
    <>
      {items?.length > 0 ? (
        <>
          {items.map((item: Item) => (
            <ItemCard key={item.id.toString()} item={item}></ItemCard>
          ))}
        </>
      ) : (
        <Typography css={classes.noItems} variant="h5">
          No Items available.
        </Typography>
      )}
    </>
  );
};

export { ItemCardList };
export type { ItemCardListProps };
