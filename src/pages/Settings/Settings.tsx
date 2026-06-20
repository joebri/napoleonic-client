import { AppSnackBar } from '@components/AppSnackBar/AppSnackBar';
import BackspaceOutlinedIcon from '@mui/icons-material/Backspace';
import SaveIcon from '@mui/icons-material/Save';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent } from 'react';

import styles from './Settings.module.scss';
import { useSettings } from './useSettings';

const Settings = () => {
    const moduleName = `${Settings.name}.tsx`;

    const {
        hideMessage,
        isMessageVisible,
        resetTemplate,
        template,
        tryTemplateSave,
        updateTemplateValue,
    } = useSettings(moduleName);

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: string
    ) => {
        updateTemplateValue(field, event.target.value);
    };

    const handleCancelClick = () => {
        resetTemplate();
    };

    const handleSaveClick = () => {
        tryTemplateSave();
    };

    const handleMessageClose = () => {
        hideMessage();
    };

    return (
        <>
            <div className={styles.container}>
                <Typography variant="h5">Item Template</Typography>
                <TextField
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    label="Image Url"
                    margin="normal"
                    onChange={(event) => handleChange(event, 'urlRoot')}
                    value={template.urlRoot}
                    variant="standard"
                />
                <TextField
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    label="Tags"
                    margin="normal"
                    onChange={(event) => handleChange(event, 'tags')}
                    value={template.tags}
                    variant="standard"
                />
                <TextField
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    label="Artist"
                    margin="normal"
                    onChange={(event) => handleChange(event, 'artist')}
                    value={template.artist}
                    variant="standard"
                />

                <TextField
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    label="Year From"
                    margin="normal"
                    onChange={(event) => handleChange(event, 'yearFrom')}
                    value={template.yearFrom}
                    variant="standard"
                />

                <TextField
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    label="Year To"
                    margin="normal"
                    onChange={(event) => handleChange(event, 'yearTo')}
                    value={template.yearTo}
                    variant="standard"
                />

                <div className={styles.actionBar}>
                    <Stack direction="row" gap={1}>
                        <Button
                            onClick={handleCancelClick}
                            size="small"
                            startIcon={<BackspaceOutlinedIcon />}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveClick}
                            size="small"
                            startIcon={<SaveIcon />}
                            variant="contained"
                        >
                            Save
                        </Button>
                    </Stack>
                </div>
            </div>

            <AppSnackBar
                message="Settings saved!"
                onClose={handleMessageClose}
                open={isMessageVisible}
                severity="success"
            ></AppSnackBar>
        </>
    );
};

export { Settings };
