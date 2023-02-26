/** @jsxImportSource @emotion/react */

import Typography from '@mui/material/Typography';
import { Helmet } from 'react-helmet-async';

import { AppSnackBar } from '../../components/AppSnackBar/AppSnackBar';
import { Edit } from './Edit';
import { classes } from './ItemDetail.style';
import { useItemDetailAdd } from './useItemDetailAdd';

const ItemDetailAdd = () => {
  const moduleName = `${ItemDetailAdd.name}.tsx`;

  const {
    handleEditCancelClick,
    handleEditChange,
    handleEditSaveClick,
    handleMessageClose,
    item,
    showMessage,
  } = useItemDetailAdd(moduleName);

  return (
    <>
      <Helmet>
        <title>Uniformology: Add Item</title>
      </Helmet>
      <div css={classes.container}>
        <Typography variant="h5">Add Item</Typography>
        <Edit
          item={item}
          onCancel={handleEditCancelClick}
          onChange={handleEditChange}
          onSave={handleEditSaveClick}
        />
      </div>

      <AppSnackBar
        message="Unable to create item. Please try again."
        onClose={handleMessageClose}
        open={showMessage}
      />
    </>
  );
};

export { ItemDetailAdd };
