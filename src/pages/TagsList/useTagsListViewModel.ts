import { useLazyQuery } from '@apollo/client/react';
import { LoadStatus } from '@enums/loadStatus.enum';
import { useHelmet } from '@hooks/useHelmet';
import { useNavigationTags } from '@hooks/useNavigationTags';
import { ItemTag } from '@models/ItemTag.model';
import { TagCount } from '@models/TagCount.model';
import { logError } from '@utilities/logError';
import { useEffect, useState } from 'react';

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

    const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false);

    const sortField = useSortFieldStateGet();

    const { clearHeaderNavigationTags } = useNavigationTags();

    const [readItemTagCounts, { data, error }] = useLazyQuery(
        readItemTagCountsQuery
    );

    useEffect(() => {
        readItemTagCounts();
    }, [readItemTagCounts]);

    useEffect(() => {
        if (data?.readItemTagCounts) {
            const sortedItemTags = data.readItemTagCounts.toSorted(
                (a: TagCount, b: TagCount) => a.name.localeCompare(b.name)
            );
            setItemTags(sortedItemTags);
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
        const sortedItemTags =
            sortField.allTagsSort === 'tagName'
                ? itemTags.toSorted((a, b) => a.name.localeCompare(b.name))
                : itemTags.toSorted((a, b) => b.count - a.count);
        setItemTags(sortedItemTags);
    }, [itemTags, sortField]);

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
        let newItemTags: ItemTag[] = itemTags.map((itemTag) => {
            return { ...itemTag };
        });
        newItemTags[index].isSelected = !newItemTags[index].isSelected;
        setItemTags(newItemTags);

        const isAnySelected = newItemTags.some((itemTag: ItemTag) => {
            return itemTag.isSelected;
        });
        setIsSearchEnabled(isAnySelected);
    };

    return {
        itemTags,
        error,
        getSelectedItemTags,
        isSearchEnabled,
        loadStatus,
        updateSelectedItemTags,
    };
};
