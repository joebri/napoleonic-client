/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';

import { classes } from './TagTooltip.style';

interface TagTooltipProps {
  tagNames: string[];
}

const TagTooltip = ({ tagNames }: TagTooltipProps) => {
  const [tagString, setTagString] = useState('');

  useEffect(() => {
    if (tagNames) {
      const tagString = 'Tags: ' + tagNames.join(', ');
      setTagString(tagString);
    }
  }, [tagNames]);

  return (
    <Tooltip title={tagString} css={classes.tooltip}>
      <LabelOutlinedIcon />
    </Tooltip>
  );
};

export { TagTooltip };
