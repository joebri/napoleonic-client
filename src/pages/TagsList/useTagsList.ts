import { useLazyQuery } from '@apollo/client/react';
import { LoadStatus } from '@enums/loadStatus.enum';
import { useHelmet } from '@hooks/useHelmet';
import { useNavigationTags } from '@hooks/useNavigationTags';
import { TagCount } from '@models/TagCount.model';
import { useHeaderTitleStateSet, useSortFieldState } from '@state';
import { TagsSortOrder } from '@state/sortField.state';
import { logError } from '@utilities/logError';
import { useEffect, useMemo, useState } from 'react';

import { readItemTagCountsQuery } from './queries/readItemTagCountsQuery';

export const useTagsList = (moduleName: string) => {
    const helmet = useHelmet();
    const setHeaderTitle = useHeaderTitleStateSet();

    // const includeUnknownYear = useIncludeUnknownYearStateGet();
    // const ratings = useRatingsStateGet();
    // const tags = useTagsStateGet();
    // const yearRange = useYearRangeStateGet();

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );

    const [tagCounts, setTagCounts] = useState<TagCount[]>([]);
    const [sortField, setSortField] = useSortFieldState();
    const [selectedTagNames, setSelectedTagNames] = useState(new Set());

    const sortedTagCounts = useMemo(() => {
        return sortField.allTagsSort === TagsSortOrder.Name
            ? tagCounts.toSorted((a, b) => a.name.localeCompare(b.name))
            : tagCounts.toSorted((a, b) => b.count - a.count);
    }, [sortField.allTagsSort, tagCounts]);

    const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false);

    const { clearHeaderNavigationTags } = useNavigationTags();

    const [readItemTagCounts, { data, error }] = useLazyQuery(
        readItemTagCountsQuery
    );

    useEffect(() => {
        readItemTagCounts();
    }, [readItemTagCounts]);

    useEffect(() => {
        if (data?.readItemTagCounts) {
            setTagCounts(data.readItemTagCounts);
            setSortField((prevSortField) => {
                return {
                    ...prevSortField,
                    allTagsSort: TagsSortOrder.Count,
                };
            });
            setLoadStatus(LoadStatus.LOADED);
        }
    }, [data, setSortField]);

    useEffect(() => {
        if (error) {
            logError({
                moduleName,
                name: 'readItemTagCounts',
                exception: error,
            });
            setLoadStatus(LoadStatus.ERROR);
        }
    }, [error, moduleName]);

    useEffect(() => {
        helmet.setTitle('Uniformology: Tags');
    }, [helmet]);

    useEffect(() => {
        setHeaderTitle('Tags');
        clearHeaderNavigationTags();
    }, [clearHeaderNavigationTags, setHeaderTitle]);

    const getSelectedTagCountNames = () => {
        const selected = encodeURIComponent(
            tagCounts
                .filter((tag: TagCount) => selectedTagNames.has(tag.name))
                .map((tag: TagCount) => tag.name)
                .join('||')
        );
        return selected;
    };

    const updateSelectedTagNames = (name: string) => {
        setSelectedTagNames((prevModifiedTagNames) => {
            const nextModifiedTagNames = new Set(prevModifiedTagNames);
            if (nextModifiedTagNames.has(name)) {
                nextModifiedTagNames.delete(name);
            } else {
                nextModifiedTagNames.add(name);
            }

            setIsSearchEnabled(nextModifiedTagNames.size > 0);

            return nextModifiedTagNames;
        });
    };

    return {
        tagCounts: sortedTagCounts,
        error,
        getSelectedTagCountNames,
        isSearchEnabled,
        loadStatus,
        updateSelectedTagNames,
        selectedTagNames,
    };
};
