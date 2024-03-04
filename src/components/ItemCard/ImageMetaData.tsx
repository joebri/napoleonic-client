import CodeIcon from '@mui/icons-material/Code';
import { Button, IconButton } from '@mui/material';

import { Loading } from 'components/Loading/Loading';

import { ItemMetaData } from 'types';

import styles from './ItemCard.module.scss';

interface ImageMetaDataProps {
    metaData: ItemMetaData;
    onClose: Function;
}

const ImageMetaData = ({ metaData, onClose }: ImageMetaDataProps) => {
    const handleMetaDataClose = () => {
        onClose();
    };

    const handleUrlButtonClick = () => {
        navigator.clipboard.writeText(metaData.url);
    };

    return (
        <>
            {metaData.height ? (
                <>
                    <p>
                        <label>Height:</label>
                        {metaData.height?.toLocaleString()}px
                    </p>
                    <p>
                        <label>Width:</label>
                        {metaData.width?.toLocaleString()}px
                    </p>
                    <p>
                        <label>Bytes:</label>
                        {metaData.bytes?.toLocaleString()}
                    </p>
                    <p>
                        <label>Url:</label>
                        <IconButton
                            color="inherit"
                            className={styles.url_icon_button}
                            edge="start"
                            onClick={handleUrlButtonClick}
                            size="small"
                        >
                            <CodeIcon />
                        </IconButton>
                    </p>
                    <Button onClick={handleMetaDataClose} variant="contained">
                        Show image
                    </Button>
                </>
            ) : (
                <div className={styles.loading_container}>
                    <Loading />
                </div>
            )}
        </>
    );
};

export { ImageMetaData };
