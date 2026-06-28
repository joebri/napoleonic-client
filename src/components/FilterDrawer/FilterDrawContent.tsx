import { FilterTag } from '@models/FilterTag.model';
import {
    Box,
    Button,
    Checkbox,
    Chip,
    FormControlLabel,
    Slider,
    Stack,
    Typography,
} from '@mui/material';
import {
    useIncludeUnknownYearState,
    useIsFilterOpenState,
    useRatingsState,
    useTagsState,
    useYearRangeState,
} from '@state';
import { ChangeEvent, useMemo, useState } from 'react';

import styles from './FilterDraw.module.scss';
import { ActionEnum } from './FilterDrawer';

const IS_ALL_YEARS = 'isAllYears';
const IS_ALL_YEARS_RANGE = [1700, 1900];
const DEFAULT_SLIDER_YEAR_RANGE = [1790, 1815];
const SLIDER_YEAR_RANGE = [1750, 1820];

type TagProps = {
    onClick: (tag: FilterTag) => void;
    tag: FilterTag;
};

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

type FilterDrawerProps = {
    onActionSelect: Function;
};

export const FilterDrawerContent = ({ onActionSelect }: FilterDrawerProps) => {
    const setIsFilterOpen = useIsFilterOpenState()[1];

    // Global state
    const [globalTags, setTags] = useTagsState();
    const [globalRatings, setRatings] = useRatingsState();
    const [globalYearRange, setYearRange] = useYearRangeState();
    const [globalIncludeUnknownYear, setIncludeUnknownYear] =
        useIncludeUnknownYearState();

    // Local state
    const [localTags, setLocalTags] = useState<FilterTag[]>(globalTags);
    const [localRatings, setLocalRatings] = useState({
        high: globalRatings.high,
        medium: globalRatings.medium,
        low: globalRatings.low,
    });
    const [localTimeline, setLocalTimeline] = useState({
        isAllYears: globalYearRange[0] === 1700 && globalYearRange[1] === 1900,
        includeUnknownYear: globalIncludeUnknownYear,
        yearRange: globalYearRange,
    });

    const availableTags = useMemo(() => {
        const sorted = [...localTags].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
        return {
            nation: sorted.filter((t) => t.group === 'Nation'),
            type: sorted.filter((t) => t.group === 'Type'),
            subType: sorted.filter((t) => t.group === 'SubType'),
        };
    }, [localTags]);

    const handleButtonClick = (action: ActionEnum) => {
        setTags(localTags);

        setRatings({
            high: localRatings.high,
            medium: localRatings.medium,
            low: localRatings.low,
        });

        setYearRange(
            localTimeline.isAllYears
                ? IS_ALL_YEARS_RANGE
                : localTimeline.yearRange
        );
        setIncludeUnknownYear(localTimeline.includeUnknownYear);

        setIsFilterOpen(false);
        onActionSelect(action);
    };

    const handleTagClick = (selectedTag: FilterTag) => {
        const updatedTags = localTags.map((tag: FilterTag) => {
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

    const handleRatingChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;

        setLocalRatings((previous) => ({
            ...previous,
            [name]: checked,
        }));
    };

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;

        setLocalTimeline((previous) => {
            const next = { ...previous, [name]: checked };
            if (name === IS_ALL_YEARS && !checked) {
                next.yearRange = DEFAULT_SLIDER_YEAR_RANGE;
            }
            return next;
        });
    };

    const handleYearChange = (_: Event, newValue: number | number[]) => {
        setLocalTimeline((previous) => ({
            ...previous,
            yearRange: newValue as number[],
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.subContainerTop}>
                <div className={styles.section}>
                    <Typography variant="h5">Nationality</Typography>
                    <Stack className={styles.tagGroup} direction={'row'}>
                        {availableTags.nation.map(
                            (tag: FilterTag, index: number) => (
                                <TagButton
                                    key={index}
                                    onClick={handleTagClick}
                                    tag={tag}
                                />
                            )
                        )}
                    </Stack>
                </div>
                <div className={styles.section}>
                    <Typography variant="h5">Type</Typography>
                    <Stack className={styles.tagGroup} direction={'row'}>
                        {availableTags.type.map(
                            (tag: FilterTag, index: number) => (
                                <TagButton
                                    key={index}
                                    onClick={handleTagClick}
                                    tag={tag}
                                />
                            )
                        )}
                    </Stack>
                </div>
                <div className={styles.section}>
                    <Typography variant="h5">Sub Type</Typography>
                    <Stack className={styles.tagGroup} direction={'row'}>
                        {availableTags.subType.map(
                            (tag: FilterTag, index: number) => (
                                <TagButton
                                    key={index}
                                    onClick={handleTagClick}
                                    tag={tag}
                                />
                            )
                        )}
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
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={localTimeline.isAllYears}
                                    name={IS_ALL_YEARS}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            className={styles.yearsCheckbox}
                            label="All?"
                        />
                        {!localTimeline.isAllYears && (
                            <>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                localTimeline.includeUnknownYear
                                            }
                                            name="includeUnknownYear"
                                            onChange={handleCheckboxChange}
                                        />
                                    }
                                    className={styles.yearsCheckbox}
                                    label="Include unknown?"
                                />
                                <Typography
                                    variant="h5"
                                    className={styles.years}
                                    data-testid="year-range"
                                >
                                    {localTimeline.yearRange[0]} -{' '}
                                    {localTimeline.yearRange[1]}
                                </Typography>
                            </>
                        )}
                    </Stack>

                    <Box className={styles.sliderContainer}>
                        <Slider
                            className={
                                localTimeline.isAllYears
                                    ? styles.sliderHidden
                                    : undefined
                            }
                            getAriaLabel={() => 'Year range'}
                            min={SLIDER_YEAR_RANGE[0]}
                            max={SLIDER_YEAR_RANGE[1]}
                            onChange={handleYearChange}
                            value={localTimeline.yearRange}
                            valueLabelDisplay="auto"
                        />
                    </Box>
                </div>
                <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
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
                    onClick={() => handleButtonClick(ActionEnum.ShowBattles)}
                >
                    Show Battles
                </Button>

                <Button
                    variant="contained"
                    onClick={() => handleButtonClick(ActionEnum.ShowAllTags)}
                >
                    Show All Tags
                </Button>
            </div>
        </div>
    );
};
