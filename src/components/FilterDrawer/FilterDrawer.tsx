/** @jsxImportSource @emotion/react */

import {
  Box,
  Button,
  Checkbox,
  Chip,
  Drawer,
  FormControlLabel,
  Slider,
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
  const {
    isFilterOpen,
    setIsFilterOpen,
    ratings,
    setRatings,
    tags,
    setTags,
    setYearRange,
    includeUnknownYear,
    setIncludeUnknownYear,
  } = useAppContext();

  const [localTags, setLocalTags] = useState<Tag[]>([]);

  const [localRatings, setLocalRatings] = useState({
    high: false,
    medium: false,
    low: false,
  });

  const [localYearRange, setLocalYearRange] = useState<number[]>([1790, 1815]);

  const [localIncludeUnknownYear, setLocalIncludeUnknownYear] =
    useState<boolean>(true);

  useEffect(() => {
    setLocalTags(tags);
  }, [tags]);

  useEffect(() => {
    setLocalRatings(ratings);
  }, [ratings]);

  useEffect(() => {
    setLocalIncludeUnknownYear(includeUnknownYear);
  }, [includeUnknownYear]);

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
    setYearRange(localYearRange);
    setIncludeUnknownYear(localIncludeUnknownYear);
    setIsFilterOpen(false);
    onActionSelect(action);
  };

  const handleRatingChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLocalRatings({
      ...localRatings,
      [event.target.name]: event.target.checked,
    });
  };

  const handleYearChange = (event: Event, newValue: number | number[]) => {
    setLocalYearRange(newValue as number[]);
  };

  const handleIncludeUnknownYearChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setLocalIncludeUnknownYear(event.target.checked);
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

          <div css={classes.section}>
            <Stack direction={'row'}>
              <Typography variant="h5">Years </Typography>
              <Typography variant="h5" css={classes.years}>
                {localYearRange[0]} - {localYearRange[1]}
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={localIncludeUnknownYear}
                    onChange={handleIncludeUnknownYearChange}
                  />
                }
                css={classes.years_checkbox}
                label="Include unknown?"
              />
            </Stack>
            <Box css={classes.slider_container}>
              <Slider
                getAriaLabel={() => 'Temperature range'}
                min={1780}
                max={1820}
                onChange={handleYearChange}
                value={localYearRange}
                valueLabelDisplay="auto"
              />
            </Box>
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
