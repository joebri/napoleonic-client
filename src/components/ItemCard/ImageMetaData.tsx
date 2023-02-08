/** @jsxImportSource @emotion/react */

import { Button, IconButton } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import styled from '@emotion/styled';

import { classes } from './ItemCard.style';
import { ItemMetaData } from 'types';
import { Loading } from 'components/Loading/Loading';

const Label = styled.label`
  font-weight: bold;
  margin-right: 0.25rem;
`;

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
            <Label>Height:</Label>
            {metaData.height?.toLocaleString()}px
          </p>
          <p>
            <Label>Width:</Label>
            {metaData.width?.toLocaleString()}px
          </p>
          <p>
            <Label>Bytes:</Label>
            {metaData.bytes?.toLocaleString()}
          </p>
          <p>
            <Label>Url:</Label>
            <IconButton
              color="inherit"
              css={classes.url_icon_button}
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
        <div css={classes.loading_container}>
          <Loading />
        </div>
      )}
    </>
  );
};

export { ImageMetaData };
