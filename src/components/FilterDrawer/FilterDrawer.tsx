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

import {
    useIncludeUnknownYearState,
    useIsFilterOpenState,
    useRatingsState,
    useTagsState,
    useYearRangeState,
} from 'state';
import { Tag } from 'types/Tag.type';

import styles from './FilterDraw.module.scss';

enum ActionEnum {
    Search,
    ShowArtists,
    ShowBattles,
    ShowCollections,
    ShowRegiments,
}

interface TagProps {
    onClick: Function;
    tag: Tag;
}

const TagButton = ({ onClick, tag }: TagProps) => {
    return (
        <Chip
            color="primary"
            label={tag.name}
            onClick={() => {
                onClick(tag);
            }}
            variant={tag.isSelected ? undefined : 'outlined'}
        />
    );
};

interface FilterDrawerProps {
    onActionSelect: Function;
}

const FilterDrawer = ({ onActionSelect }: FilterDrawerProps) => {
    const [includeUnknownYear, setIncludeUnknownYear] =
        useIncludeUnknownYearState();
    const [isFilterOpen, setIsFilterOpen] = useIsFilterOpenState();
    const [ratings, setRatings] = useRatingsState();
    const [tags, setTags] = useTagsState();
    const [yearRange, setYearRange] = useYearRangeState();

    const [localTags, setLocalTags] = useState<Tag[]>([]);

    const [localRatings, setLocalRatings] = useState({
        high: false,
        medium: false,
        low: false,
    });

    const [localYearRange, setLocalYearRange] = useState<number[]>([
        1790, 1815,
    ]);

    const [localIncludeUnknownYear, setLocalIncludeUnknownYear] =
        useState<boolean>(true);

    useEffect(() => {
        setLocalTags(tags);
    }, [tags]);

    useEffect(() => {
        setLocalRatings(ratings);
    }, [ratings]);

    useEffect(() => {
        setLocalYearRange(yearRange);
    }, [yearRange]);

    useEffect(() => {
        setLocalIncludeUnknownYear(includeUnknownYear);
    }, [includeUnknownYear]);

    const handleTagClick = (selectedTag: Tag) => {
        const updatedTags = localTags.map((tag: Tag) => {
            if (tag.name === selectedTag.name) {
                return {
                    ...tag,
                    isSelected: !tag.isSelected,
                };
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

    const handleYearChange = (_: Event, newValue: number | number[]) => {
        setLocalYearRange(newValue as number[]);
    };

    const handleIncludeUnknownYearChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setLocalIncludeUnknownYear(event.target.checked);
    };

    return (
        <Drawer
            className={styles.filters}
            anchor={'right'}
            open={isFilterOpen}
            onClose={handleDrawerClose}
        >
            <div className={styles.container}>
                <div className={styles.subContainerTop}>
                    <div className={styles.section}>
                        <Typography variant="h5">Nationality</Typography>
                        <Stack className={styles.tagGroup} direction={'row'}>
                            {localTags
                                .filter((tag: Tag) => tag.group === 'Nation')
                                .sort((a: Tag, b: Tag) => {
                                    if (a.name === b.name) {
                                        return 0;
                                    }
                                    return a.name > b.name ? 1 : -1;
                                })
                                .map((tag: Tag, index: number) => (
                                    <TagButton
                                        key={index}
                                        onClick={handleTagClick}
                                        tag={tag}
                                    />
                                ))}
                        </Stack>
                    </div>
                    <div className={styles.section}>
                        <Typography variant="h5">Type</Typography>
                        <Stack className={styles.tagGroup} direction={'row'}>
                            {localTags
                                .filter((tag: Tag) => tag.group === 'Type')
                                .map((tag: Tag, index: number) => (
                                    <TagButton
                                        key={index}
                                        onClick={handleTagClick}
                                        tag={tag}
                                    />
                                ))}
                        </Stack>
                    </div>
                    <div className={styles.section}>
                        <Typography variant="h5">Sub Type</Typography>
                        <Stack className={styles.tagGroup} direction={'row'}>
                            {localTags
                                .filter((tag: Tag) => tag.group === 'SubType')
                                .map((tag: Tag, index: number) => (
                                    <TagButton
                                        key={index}
                                        onClick={handleTagClick}
                                        tag={tag}
                                    />
                                ))}
                        </Stack>
                    </div>
                    <div className={styles.section}>
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
                    <div className={styles.section}>
                        <Stack direction={'row'}>
                            <Typography variant="h5">Years </Typography>
                            <Typography
                                variant="h5"
                                className={styles.years}
                                data-testid="year-range"
                            >
                                {localYearRange[0]} - {localYearRange[1]}
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={localIncludeUnknownYear}
                                        onChange={
                                            handleIncludeUnknownYearChange
                                        }
                                    />
                                }
                                className={styles.yearsCheckbox}
                                label="Include unknown?"
                            />
                        </Stack>
                        <Box className={styles.sliderContainer}>
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
                    <Stack gap={1} direction="row">
                        <Button
                            variant="contained"
                            onClick={() => handleButtonClick(ActionEnum.Search)}
                        >
                            Search
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() =>
                                handleButtonClick(ActionEnum.ShowArtists)
                            }
                        >
                            Show Artists
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() =>
                                handleButtonClick(ActionEnum.ShowRegiments)
                            }
                        >
                            Show Regiments
                        </Button>
                    </Stack>
                </div>
                <div className={styles.subContainerBottom}>
                    <Button
                        variant="contained"
                        onClick={() =>
                            handleButtonClick(ActionEnum.ShowCollections)
                        }
                    >
                        Show Collections
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() =>
                            handleButtonClick(ActionEnum.ShowBattles)
                        }
                    >
                        Show Battles
                    </Button>
                </div>
            </div>
        </Drawer>
    );
};

export { ActionEnum, FilterDrawer };
