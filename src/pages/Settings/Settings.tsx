import BackspaceOutlinedIcon from '@mui/icons-material/Backspace';
import SaveIcon from '@mui/icons-material/Save';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';

import { AppSnackBar } from 'components/AppSnackBar/AppSnackBar';

import { useLocalStorage } from 'hooks/useLocalStorage';
import { useNavigationTags } from 'hooks/useNavigationTags';
import { useHeaderTitleStateSet } from 'state';
import { Template } from 'types';

import styles from './Settings.module.scss';
import { useSettings } from './useSettings';

const initialisedTemplate: Template = {
    artist: '',
    tags: '',
    urlRoot: '',
    yearFrom: '',
};

const Settings = () => {
    const moduleName = `${Settings.name}.tsx`;

    const [templateLS, setTemplateLS] = useLocalStorage<Template>(
        'template',
        initialisedTemplate
    );

    const setHeaderTitle = useHeaderTitleStateSet();

    const [template, setTemplate] = useState(templateLS);
    const [showMessage, setShowMessage] = useState(false);

    const { clearHeaderNavigationTags } = useNavigationTags();

    useSettings(moduleName);

    useEffect(() => {
        setHeaderTitle('Settings');
        clearHeaderNavigationTags();
    }, [clearHeaderNavigationTags, setHeaderTitle]);

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: string
    ) => {
        setTemplate((priorTemplate: Template) => ({
            ...priorTemplate,
            [field]: event.target.value,
        }));
    };

    const handleCancelClick = () => {
        setTemplate(templateLS);
    };

    const handleSaveClick = () => {
        const updatedTemplate: Template = {
            artist: template.artist.trim(),
            tags: template.tags.trim(),
            urlRoot: template.urlRoot.trim(),
            yearFrom: template.yearFrom.trim(),
        };
        setTemplate(updatedTemplate);
        setTemplateLS(updatedTemplate);

        setShowMessage(true);
    };

    const handleMessageClose = () => {
        setShowMessage(false);
    };

    return (
        <>
            {/* <Helmet>
                <title>Uniformology: Settings</title>
            </Helmet> */}
            <div className={styles.container}>
                <Typography variant="h5">Item Template</Typography>
                <TextField
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    label="Image url"
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
                open={showMessage}
                severity="success"
            ></AppSnackBar>
        </>
    );
};

export { Settings };
