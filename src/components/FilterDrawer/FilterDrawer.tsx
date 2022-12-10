/** @jsxImportSource @emotion/react */

import { Button, Chip, Drawer, Stack, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';

import { classes } from './FilterDraw.style';
import { AppContext } from '../../pages/appContext';
import { Tag } from '../../interfaces/tag.interface';

interface FilterDrawerProps {
  onActionSelect: Function;
}

export enum ActionEnum {
  Search,
  ShowArtists,
  ShowCollections,
  ShowRegiments,
}

const FilterDrawer = ({ onActionSelect }: FilterDrawerProps) => {
  const { isFilterOpen, setIsFilterOpen, tags, setTags } =
    useContext(AppContext);

  const [localTags, setLocalTags] = useState([] as Tag[]);

  useEffect(() => {
    setLocalTags(tags);
  }, [tags]);

  const handleTagClick = (selectedTag: Tag) => {
    let updatedTags: Tag[];
    if (selectedTag.name === 'Battles') {
      tags
        .filter((tag: Tag) => {
          return tag.name !== 'Battles';
        })
        .map((tag: Tag) => {
          tag.isSelected = false;
        });
    } else {
      tags
        .filter((tag: Tag) => {
          return tag.name === 'Battles';
        })
        .map((tag: Tag) => {
          tag.isSelected = false;
        });
    }
    updatedTags = tags.map((tag: Tag) => {
      if (tag.name === selectedTag.name) {
        tag.isSelected = !tag.isSelected;
      }
      return tag;
    });
    setLocalTags(updatedTags);
  };

  const handleDrawerClose = () => {
    setIsFilterOpen(false);
  };

  const handleButtonClick = (action: ActionEnum) => {
    setTags(localTags);
    setIsFilterOpen(false);

    const selectedTags = localTags.filter((tag: Tag) => {
      return tag.isSelected;
    });
    onActionSelect(action, selectedTags);
  };

  interface TagProps {
    tag: Tag;
  }

  const Tag = ({ tag }: TagProps) => {
    return (
      <Chip
        color="primary"
        label={tag.name}
        onClick={() => {
          handleTagClick(tag);
        }}
        variant={tag.isSelected ? undefined : 'outlined'}
      />
    );
  };

  return (
    <Drawer
      css={classes.filters}
      anchor={'right'}
      open={isFilterOpen}
      onClose={handleDrawerClose}
    >
      <div css={classes.container}>
        <div css={classes.subcontainer}>
          <Stack gap={1} direction="row">
            <Button
              variant="contained"
              onClick={() => handleButtonClick(ActionEnum.Search)}
            >
              Search
            </Button>
            <Button
              variant="contained"
              onClick={() => handleButtonClick(ActionEnum.ShowRegiments)}
            >
              Show Regiments
            </Button>
          </Stack>
          <div css={classes.section}>
            <Typography variant="h5">Sections</Typography>
            <Stack css={classes.tagGroup} direction={'row'} gap={1}>
              {localTags
                .filter((tag: Tag) => tag.group === 'Section')
                .map((tag: Tag, index: number) => (
                  <Tag tag={tag} key={index} />
                ))}
            </Stack>

            <Typography variant="h5">Nationality</Typography>
            <Stack css={classes.tagGroup} direction={'row'} gap={1}>
              {localTags
                .filter((tag: Tag) => tag.group === 'Nation')
                .sort((a: Tag, b: Tag) => {
                  return a.name > b.name ? 1 : -1;
                })
                .map((tag: Tag, index: number) => (
                  <Tag tag={tag} key={index} />
                ))}
            </Stack>
          </div>
          <div css={classes.section}>
            <Typography variant="h5">Type</Typography>
            <Stack css={classes.tagGroup} direction={'row'} gap={1}>
              {localTags
                .filter((tag: Tag) => tag.group === 'Type')
                .map((tag: Tag, index: number) => (
                  <Tag tag={tag} key={index} />
                ))}
            </Stack>
          </div>
          <div css={classes.section}>
            <Typography variant="h5">Sub Type</Typography>
            <Stack css={classes.tagGroup} direction={'row'} gap={1}>
              {localTags
                .filter((tag: Tag) => tag.group === 'SubType')
                .map((tag: Tag, index: number) => (
                  <Tag tag={tag} key={index} />
                ))}
            </Stack>
          </div>
        </div>
        <div css={classes.section}>
          <Stack gap={1} direction="row">
            <Button
              variant="contained"
              onClick={() => handleButtonClick(ActionEnum.ShowArtists)}
            >
              Show Artists
            </Button>
            <Button
              variant="contained"
              onClick={() => handleButtonClick(ActionEnum.ShowCollections)}
            >
              Show Collections
            </Button>
          </Stack>
        </div>
      </div>
    </Drawer>
  );
};

export { FilterDrawer };
