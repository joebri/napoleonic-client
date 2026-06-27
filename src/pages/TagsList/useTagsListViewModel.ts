import { useLazyQuery } from '@apollo/client/react';
import { LoadStatus } from '@enums/loadStatus.enum';
import { useHelmet } from '@hooks/useHelmet';
import { useNavigationTags } from '@hooks/useNavigationTags';
import { ItemTag } from '@models/ItemTag.model';
import { TagCount } from '@models/TagCount.model';
import { logError } from '@utilities/logError';
import { useEffect, useMemo, useState } from 'react';

import { useHeaderTitleStateSet, useSortFieldStateGet } from '../../state';
import { readItemTagCountsQuery } from './queries/readItemTagCountsQuery';

export const useTagsListViewModel = (moduleName: string) => {
    // const location = useLocation();
    const helmet = useHelmet();

    // const includeUnknownYear = useIncludeUnknownYearStateGet();
    // const ratings = useRatingsStateGet();
    const setHeaderTitle = useHeaderTitleStateSet();
    // const tags = useTagsStateGet();
    // const yearRange = useYearRangeStateGet();

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(
        LoadStatus.LOADING
    );
    const [itemTags, setItemTags] = useState<ItemTag[]>([]);
    const sortField = useSortFieldStateGet();

    const sortedItemTags = useMemo(() => {
        return sortField.allTagsSort === 'tagName'
            ? itemTags.toSorted((a, b) => a.name.localeCompare(b.name))
            : itemTags.toSorted((a, b) => b.count - a.count);
    }, [itemTags, sortField.allTagsSort]);

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
            const initialTags = data.readItemTagCounts.map((tag: TagCount) => ({
                ...tag,
                isSelected: false,
            }));
            setItemTags(initialTags);
            setLoadStatus(LoadStatus.LOADED);
        }
    }, [data]);

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

    const getSelectedItemTags = () => {
        const selected = encodeURIComponent(
            itemTags
                .filter((tag: ItemTag) => tag.isSelected)
                .map((tag: ItemTag) => tag.name)
                .join('||')
        );
        return selected;
    };

    const updateSelectedItemTags = (index: number) => {
        setItemTags((prevTags) => {
            const updatedTags = prevTags.map((itemTag, idx) =>
                idx === index
                    ? { ...itemTag, isSelected: !itemTag.isSelected }
                    : itemTag
            );
            const isAnySelected = updatedTags.some(
                (itemTag) => itemTag.isSelected
            );
            setIsSearchEnabled(isAnySelected);

            return updatedTags;
        });
    };

    return {
        itemTags: sortedItemTags,
        error,
        getSelectedItemTags,
        isSearchEnabled,
        loadStatus,
        updateSelectedItemTags,
    };
};
