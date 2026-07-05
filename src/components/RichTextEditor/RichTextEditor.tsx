import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import LinkIcon from '@mui/icons-material/Link';
import TableChartIcon from '@mui/icons-material/TableChart';
import TitleIcon from '@mui/icons-material/Title';
import {
    Box,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
} from '@mui/material';
import { BubbleMenu as BubbleMenuExtension } from '@tiptap/extension-bubble-menu';
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import {
    Table,
    TableCell,
    TableHeader,
    TableRow,
} from '@tiptap/extension-table';
import { TextStyle } from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useRef } from 'react';

import styles from './RichTextEditor.module.scss';
import { TableToolBar } from './TableToolBar';

type EditorProps = {
    initialContent?: string;
    label?: string;
    onChange?: (html: string) => void;
};

export const RichTextEditor = (props: EditorProps) => {
    const editorWrapperRef = useRef<HTMLDivElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            BubbleMenuExtension,
            TextStyle,
            Color,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'editor-link' },
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableCell,
            TableHeader,
            BubbleMenuExtension.configure({
                pluginKey: 'tableBubbleMenu',
                shouldShow: ({ editor }) => editor.isActive('table'),
            }),
        ],
        content: props.initialContent,

        editorProps: {
            handlePaste(view, event) {
                const text = event.clipboardData?.getData('text/plain');

                if (text) {
                    view.dispatch(view.state.tr.insertText(text));
                    return true;
                }
                return false;
            },
        },

        onUpdate: ({ editor }) => {
            if (props.onChange) {
                props.onChange(editor.getHTML());
            }
        },
        onSelectionUpdate: () => {
            // Just declaring this forces React to catch selection switches
        },
    });

    if (!editor) {
        return null;
    }

    const addTable = () => {
        editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run();
    };

    const handleHeadingChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        if (value === 'paragraph') {
            editor.chain().focus().setParagraph().run();
        } else {
            editor
                .chain()
                .focus()
                .toggleHeading({
                    level: parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6,
                })
                .run();
        }
    };

    const addLink = () => {
        const url = prompt('Enter URL:');
        if (url === '') {
            editor.chain().focus().unsetLink().run();
        } else if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <Box className={styles.root}>
            {' '}
            {props.label && (
                <InputLabel shrink className={styles.label}>
                    {props.label}
                </InputLabel>
            )}
            <Paper
                className={`${styles.editorPaper} ${props.label ? styles.hasLabel : ''}`}
                elevation={2}
            >
                <Box className={styles.toolbar}>
                    <ToggleButtonGroup size="small">
                        <Tooltip title="Bold">
                            <ToggleButton
                                value="bold"
                                selected={editor.isActive('bold')}
                                onChange={() =>
                                    editor.chain().focus().toggleBold().run()
                                }
                            >
                                <FormatBoldIcon fontSize="small" />
                            </ToggleButton>
                        </Tooltip>

                        <Tooltip title="Italic">
                            <ToggleButton
                                value="italic"
                                selected={editor.isActive('italic')}
                                onChange={() =>
                                    editor.chain().focus().toggleItalic().run()
                                }
                            >
                                <FormatItalicIcon fontSize="small" />
                            </ToggleButton>
                        </Tooltip>
                    </ToggleButtonGroup>

                    {/* Text Structure Dropdown Menu Selector */}
                    <Select
                        size="small"
                        value={
                            editor.isActive('heading', { level: 1 })
                                ? '1'
                                : editor.isActive('heading', { level: 2 })
                                  ? '2'
                                  : 'paragraph'
                        }
                        onChange={handleHeadingChange}
                        sx={{ minWidth: 120, height: 34 }}
                        IconComponent={TitleIcon}
                    >
                        <MenuItem value="paragraph">Normal Text</MenuItem>
                        <MenuItem value="1">Heading 1</MenuItem>
                        <MenuItem value="2">Heading 2</MenuItem>
                        <MenuItem value="3">Heading 3</MenuItem>
                    </Select>

                    {/* List Alignment Structure Options */}
                    <ToggleButtonGroup size="small">
                        <Tooltip title="Bullet List">
                            <ToggleButton
                                value="bulletList"
                                selected={editor.isActive('bulletList')}
                                onChange={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleBulletList()
                                        .run()
                                }
                            >
                                <FormatListBulletedIcon fontSize="small" />
                            </ToggleButton>
                        </Tooltip>

                        <Tooltip title="Numbered List">
                            <ToggleButton
                                value="orderedList"
                                selected={editor.isActive('orderedList')}
                                onChange={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleOrderedList()
                                        .run()
                                }
                            >
                                <FormatListNumberedIcon fontSize="small" />
                            </ToggleButton>
                        </Tooltip>
                    </ToggleButtonGroup>

                    {/* Interactive URL Link Trigger Button */}
                    <Tooltip title="Insert Link">
                        <IconButton
                            className={styles.linkButton}
                            color={
                                editor.isActive('link') ? 'primary' : 'default'
                            }
                            onClick={addLink}
                            size="small"
                        >
                            <LinkIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    {/* Color Palette Control */}
                    <Tooltip title="Text Color">
                        <Box
                            component="label"
                            className={`${styles.colorButton} ${editor.isActive('textStyle') ? styles.isActive : ''}`}
                        >
                            <FormatColorTextIcon
                                className={`${styles.colourButtonIcon} ${editor.isActive('textStyle') ? styles.isActive : ''}`}
                            />
                            <input
                                type="color"
                                style={{ display: 'none' }}
                                onChange={(e) =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setColor(e.target.value)
                                        .run()
                                }
                            />
                        </Box>
                    </Tooltip>
                    <Tooltip title="Insert Table">
                        <IconButton
                            className={styles.tableButton}
                            color={
                                editor.isActive('table') ? 'primary' : 'default'
                            }
                            onClick={addTable}
                            size="small"
                        >
                            <TableChartIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* 2. Large Content Editable Text Area Box Wrapper */}
                <Box
                    className={`${styles.editorContainer} tiptap-editor-wrapper`}
                >
                    {editor && (
                        <TableToolBar
                            containerRef={editorWrapperRef}
                            editor={editor}
                        />
                    )}
                    <EditorContent editor={editor} />
                </Box>
            </Paper>
        </Box>
    );
};
