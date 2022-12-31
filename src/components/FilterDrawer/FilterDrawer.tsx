/** @jsxImportSource @emotion/react */

import {
  Button,
  Checkbox,
  Chip,
  Drawer,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';

import { classes } from './FilterDraw.style';

import { useAppContext } from 'AppContext';
import { Tag } from 'types/Tag.type';

interface FilterDrawerProps {
  onActionSelect: Function;
}

export enum ActionEnum {
  Search,
  ShowArtists,
  ShowBattles,
  ShowCollections,
  ShowRegiments,
}

const FilterDrawer = ({ onActionSelect }: FilterDrawerProps) => {
  const { isFilterOpen, setIsFilterOpen, ratings, setRatings, tags, setTags } =
    useAppContext();

  const [localTags, setLocalTags] = useState([] as Tag[]);
  const [localRatings, setLocalRatings] = useState({
    high: false,
    medium: false,
    low: false,
  });

  useEffect(() => {
    setLocalTags(tags);
  }, [tags]);
  useEffect(() => {
    setLocalRatings(ratings);
  }, [ratings]);

  const handleTagClick = (selectedTag: Tag) => {
    const updatedTags = tags.map((tag: Tag) => {
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
    const updatedTags = localTags.map((tag: Tag) => {
      return {
        ...tag,
        isSelected: tag.group === 'Collection' ? false : tag.isSelected,
      };
    });

    setTags(updatedTags);
    setRatings(localRatings);
    setIsFilterOpen(false);
    onActionSelect(action);
  };

  const handleRatingChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLocalRatings({
      ...localRatings,
      [event.target.name]: event.target.checked,
    });
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
              onClick={() => handleButtonClick(ActionEnum.ShowArtists)}
            >
              Show Artists
            </Button>
            <Button
              variant="contained"
              onClick={() => handleButtonClick(ActionEnum.ShowRegiments)}
            >
              Show Regiments
            </Button>
          </Stack>
          <div css={classes.section}>
            <Typography variant="h5">Nationality</Typography>
            <Stack css={classes.tagGroup} direction={'row'} gap={1}>
              {tags
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
              {tags
                .filter((tag: Tag) => tag.group === 'Type')
                .map((tag: Tag, index: number) => (
                  <Tag tag={tag} key={index} />
                ))}
            </Stack>
          </div>
          <div css={classes.section}>
            <Typography variant="h5">Sub Type</Typography>
            <Stack css={classes.tagGroup} direction={'row'} gap={1}>
              {tags
                .filter((tag: Tag) => tag.group === 'SubType')
                .map((tag: Tag, index: number) => (
                  <Tag tag={tag} key={index} />
                ))}
            </Stack>
          </div>

          <div css={classes.section}>
            <Typography variant="h5">Rating</Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={localRatings.high}
                  onChange={handleRatingChange}
                  name="high"
                />
              }
              label="High"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={localRatings.medium}
                  onChange={handleRatingChange}
                  name="medium"
                />
              }
              label="Medium"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={localRatings.low}
                  onChange={handleRatingChange}
                  name="low"
                />
              }
              label="Low"
            />
          </div>
        </div>
        <div css={classes.section}>
          <Stack gap={1} direction="row">
            <Button
              variant="contained"
              onClick={() => handleButtonClick(ActionEnum.ShowCollections)}
            >
              Show Collections
            </Button>

            <Button
              variant="contained"
              onClick={() => handleButtonClick(ActionEnum.ShowBattles)}
            >
              Show Battles
            </Button>
          </Stack>
        </div>
      </div>
    </Drawer>
  );
};

export { FilterDrawer };