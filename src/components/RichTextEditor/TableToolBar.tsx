import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import GridOnIcon from '@mui/icons-material/GridOn';
import { Box, IconButton, Paper, Tooltip } from '@mui/material';
import { NodeSelection } from '@tiptap/pm/state';
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
            // 1. Give it a distinct plugin key to pair it perfectly with this component
            pluginKey="tableBubbleMenu"
            // 2. Put the strict visibility parameters directly into the component's hook
            shouldShow={({ editor, state, view }) => {
                const { selection } = state;

                // Block menu if selection is explicitly a NodeSelection on an image
                if (
                    selection instanceof NodeSelection &&
                    selection.node.type.name === 'image'
                ) {
                    return false;
                }

                // Block menu if general image selection is active
                if (editor.isActive('image')) {
                    return false;
                }

                // Deep Ancestry Check: Check every depth level from the current position up.
                // If we hit an image node BEFORE hitting table layout nodes, HIDE the menu.
                const depth = selection.$anchor.depth;
                for (let i = depth; i > 0; i--) {
                    const nodeAtDepth = selection.$anchor.node(i);
                    if (nodeAtDepth && nodeAtDepth.type.name === 'image') {
                        return false;
                    }
                }

                // Fail-safe browser DOM element selector check
                const domSelection = window.getSelection();
                if (domSelection && domSelection.anchorNode) {
                    const el = domSelection.anchorNode as HTMLElement;
                    if (
                        el.nodeName === 'IMG' ||
                        (el.querySelector && el.querySelector('img')) ||
                        (el.parentElement &&
                            el.parentElement.nodeName === 'IMG')
                    ) {
                        return false;
                    }
                }

                // Only display if the cursor is in a table structure and the editor window is targeted
                return editor.isActive('table') && view.hasFocus();
            }}
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
