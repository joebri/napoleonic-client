import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Paper, Tooltip } from '@mui/material';
import { NodeSelection } from '@tiptap/pm/state';
import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';

import styles from './RichTextEditor.module.scss';

type ImageToolBarProps = {
    containerRef: React.RefObject<HTMLDivElement | null>;
    editor: Editor;
};

export const ImageToolBar = ({ containerRef, editor }: ImageToolBarProps) => {
    const handleEditUrl = () => {
        const { selection } = editor.state;
        if (
            selection instanceof NodeSelection &&
            selection.node.type.name === 'image'
        ) {
            const currentUrl = selection.node.attrs.src || '';
            const newUrl = window.prompt('Update image URL:', currentUrl);

            if (newUrl) {
                editor
                    .chain()
                    .focus()
                    .updateAttributes('image', { src: newUrl })
                    .run();
            }
        }
    };

    return (
        <BubbleMenu
            appendTo={containerRef.current || undefined}
            editor={editor}
            pluginKey="imageBubbleMenu" // Must be unique from your tableBubbleMenu key!
            shouldShow={({ state, view }) => {
                const { selection } = state;
                // Strictly ONLY show this menu if an image node selection is active
                return (
                    selection instanceof NodeSelection &&
                    selection.node.type.name === 'image' &&
                    view.hasFocus()
                );
            }}
        >
            <Paper
                className={styles.tableToolbar}
                elevation={3}
                sx={{ p: 0.5, display: 'flex', gap: 0.5 }}
            >
                <Tooltip title="Edit Image URL">
                    <IconButton size="small" onClick={handleEditUrl}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Delete Image">
                    <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                            editor.chain().focus().deleteSelection().run()
                        }
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Paper>
        </BubbleMenu>
    );
};
