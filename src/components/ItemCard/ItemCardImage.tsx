import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { LegacyRef, createRef, useEffect, useState } from 'react';

import { getLocalImage } from 'helpers/imageService';
import { Item, ItemMetaData } from 'types';

import styles from './ItemCard.module.scss';

const parseDescriptionForImage = (descriptionLong: string): string => {
    const match = descriptionLong.match(/<img src="([\w\W]+?)["][ ]?\/>/i);
    const url = match ? match[1] : '';
    return url;
};

interface ItemCardImageProps {
    item: Item;
    onMetaDataChange: (itemMetaData: ItemMetaData) => void;
}

const ItemCardImage = ({ item, onMetaDataChange }: ItemCardImageProps) => {
    const [alternateImageUrl, setAlternateImageUrl] = useState('');
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

    const imgRef: LegacyRef<HTMLImageElement> = createRef();

    useEffect(() => {
        if (!item.publicId) {
            const url = parseDescriptionForImage(item.descriptionLong);
            if (url) {
                setAlternateImageUrl(url);
            }
        }
    }, [item]);

    const handleImageClick = () => {
        setIsImageDialogOpen(true);
    };

    const handleImageLoad = async () => {
        const url = getLocalImage(item.publicId);

        try {
            const fileImg = await fetch(url).then((response) =>
                response.blob()
            );
            const itemMetaData: ItemMetaData = {
                bytes: fileImg?.size || 0,
                height: imgRef.current?.naturalHeight || 0,
                width: imgRef.current?.naturalWidth || 0,
                url,
            };
            onMetaDataChange(itemMetaData);
        } catch (exception) {
            const itemMetaData: ItemMetaData = {
                bytes: 0,
                height: 0,
                width: 0,
                url,
            };
            onMetaDataChange(itemMetaData);
        }
    };

    const handleImageDialogClose = () => {
        setIsImageDialogOpen(false);
    };

    return (
        <>
            {item.publicId ? (
                <>
                    <img
                        alt=""
                        className={styles.image}
                        onClick={handleImageClick}
                        onLoad={handleImageLoad}
                        ref={imgRef}
                        src={getLocalImage(item.publicId)}
                        title={item.publicId}
                    />
                    {item.artist && (
                        <Typography
                            className={styles.artist}
                            variant="body2"
                            color="text.secondary"
                        >
                            {item.artist}
                        </Typography>
                    )}
                </>
            ) : (
                <>
                    {alternateImageUrl && (
                        <>
                            <img src={alternateImageUrl} alt="uniform plate" />
                            {item.artist && (
                                <>
                                    <Typography
                                        className={styles.artist}
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {item.artist}
                                    </Typography>
                                </>
                            )}
                        </>
                    )}
                </>
            )}

            <Dialog onClose={handleImageDialogClose} open={isImageDialogOpen}>
                <img
                    alt=""
                    className={styles.image}
                    src={getLocalImage(item.publicId)}
                    title={item.publicId}
                />
            </Dialog>
        </>
    );
};

export { ItemCardImage };
