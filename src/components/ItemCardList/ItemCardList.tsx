/** @jsxImportSource @emotion/react */

import { classes } from './ItemCardList.style';
import { ItemCard } from 'components/ItemCard/ItemCard';

import { Item } from '../../types';

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
        <div css={classes.noItems}>No items available.</div>
      )}
    </>
  );
};

export { ItemCardList };
export type { ItemCardListProps };
