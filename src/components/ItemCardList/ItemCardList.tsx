/** @jsxImportSource @emotion/react */

import { classes } from './ItemCardList.style';
import { ItemCard } from 'components/ItemCard/ItemCard';

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
