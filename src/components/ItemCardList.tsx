/** @jsxImportSource @emotion/react */

import { ItemCard } from './ItemCard';
import { classes } from './ItemCard.style';

interface ItemCardListProps {
  items: [];
}

const ItemCardList = ({ items }: ItemCardListProps) => {
  return (
    <>
      {items?.length > 0 ? (
        <>
          {items.map((item: any) => (
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
