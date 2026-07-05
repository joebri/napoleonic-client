import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import GridOnIcon from '@mui/icons-material/GridOn';
import { Box, IconButton, Paper, Tooltip } from '@mui/material';
import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';

import styles from './RichTextEditor.module.scss';

type TableToolBarProps = {
    containerRef: React.RefObject<HTMLDivElement | null>;
    editor: Editor;
};

export const TableToolBar = ({ containerRef, editor }: TableToolBarProps) => {
    return (
        <BubbleMenu
            appendTo={containerRef.current || undefined}
            editor={editor}
        >
            <Paper className={styles.tableToolbar} elevation={3}>
                {/* Row Actions */}
                <Tooltip title="Add Row Above">
                    <IconButton
                        size="small"
                        onClick={() =>
                            editor.chain().focus().addRowBefore().run()
                        }
                    >
                        <AddBoxIcon
                            fontSize="small"
                            sx={{ transform: 'rotate(180deg)' }}
                        />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Add Row Below">
                    <IconButton
                        size="small"
                        onClick={() =>
                            editor.chain().focus().addRowAfter().run()
                        }
                    >
                        <AddBoxIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete Row">
                    <IconButton
                        size="small"
                        color="error"
                        onClick={() => editor.chain().focus().deleteRow().run()}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                {/* Small Vertical Divider Line */}
                <Box
                    sx={{
                        borderLeft: '1px solid',
                        borderColor: 'grey.300',
                        height: 20,
                        mx: 0.5,
                    }}
                />

                {/* Column Actions */}
                <Tooltip title="Add Column Left">
                    <IconButton
                        size="small"
                        onClick={() =>
                            editor.chain().focus().addColumnBefore().run()
                        }
                    >
                        <GridOnIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Add Column Right">
                    <IconButton
                        size="small"
                        onClick={() =>
                            editor.chain().focus().addColumnAfter().run()
                        }
                    >
                        <GridOnIcon fontSize="small" sx={{ opacity: 0.7 }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete Column">
                    <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                            editor.chain().focus().deleteColumn().run()
                        }
                    >
                        <DeleteIcon fontSize="small" sx={{ opacity: 0.7 }} />
                    </IconButton>
                </Tooltip>

                {/* Small Vertical Divider Line */}
                <Box
                    sx={{
                        borderLeft: '1px solid',
                        borderColor: 'grey.300',
                        height: 20,
                        mx: 0.5,
                    }}
                />

                {/* Delete Entire Table */}
                <Tooltip title="Delete Entire Table">
                    <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                            editor.chain().focus().deleteTable().run()
                        }
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Paper>
        </BubbleMenu>
    );
};
