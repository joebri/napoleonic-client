import { ErrorHandler } from '@components/ErrorHandler/ErrorHandler';
import {
    ActionEnum,
    FilterDrawer,
} from '@components/FilterDrawer/FilterDrawer';
import { Loading } from '@components/Loading/Loading';
import { MenuBar } from '@components/MenuBar/MenuBar';
import { LoadStatus } from '@enums/loadStatus.enum';
import { CollectionDetailEdit } from '@pages/CollectionDetail/CollectionDetailEdit';
import { CollectionList } from '@pages/CollectionList/CollectionList';
import { Gallery } from '@pages/Gallery/Gallery';
import { ItemDetailAdd } from '@pages/ItemDetail/ItemDetailAdd';
import { ItemDetailEdit } from '@pages/ItemDetail/ItemDetailEdit';
import { ItemDetailView } from '@pages/ItemDetail/ItemDetailView';
import { NotFound } from '@pages/NotFound/NotFound';
import { Settings } from '@pages/Settings/Settings';
import { TagsList } from '@pages/TagsList/TagsList';
import { Suspense, lazy, useEffect, useRef } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import styles from './Home.module.scss';
import { useHome } from './useHome';

const ArtistsList = lazy(() =>
    import('@pages/ArtistsList/ArtistsList').then((module) => ({
        default: module.ArtistsList,
    }))
);
const BattlesList = lazy(() =>
    import('@pages/BattlesList/BattlesList').then((module) => ({
        default: module.BattlesList,
    }))
);
const CollectionDetailAdd = lazy(() =>
    import('@pages/CollectionDetail/CollectionDetailAdd').then((module) => ({
        default: module.CollectionDetailAdd,
    }))
);
// const CollectionDetailEdit = lazy(() =>
//     import('@pages/CollectionDetail/CollectionDetailEdit').then((module) => ({
//         default: module.CollectionDetailEdit,
//     }))
// );
const CollectionDetailView = lazy(() =>
    import('@pages/CollectionDetail/CollectionDetailView').then((module) => ({
        default: module.CollectionDetailView,
    }))
);
const RegimentsList = lazy(() =>
    import('@pages/RegimentsList/RegimentsList').then((module) => {
        return {
            default: module.RegimentsList,
        };
    })
);

export const Home = () => {
    const moduleName = `${Home.name}.tsx`;

    const navigate = useNavigate();
    const { error, loadStatus, resetSearchParams, setPageNumber } =
        useHome(moduleName);

    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            resetSearchParams();
            isInitialMount.current = false;
        }
    }, [resetSearchParams]);

    const handleFilterDrawAction = (action: ActionEnum) => {
        setPageNumber(1);

        if (action === ActionEnum.ShowArtists) {
            navigate(`/artists`);
            return;
        }

        if (action === ActionEnum.ShowBattles) {
            navigate(`/battles`);
            return;
        }

        if (action === ActionEnum.ShowCollections) {
            navigate(`/collections`);
            return;
        }

        if (action === ActionEnum.ShowRegiments) {
            navigate(`/regiments`);
            return;
        }

        if (action === ActionEnum.ShowAllTags) {
            navigate(`/allTags`);
            return;
        }

        resetSearchParams();

        navigate(`/gallery`);
    };

    if (loadStatus === LoadStatus.LOADING) {
        return <Loading />;
    }
    if (loadStatus === LoadStatus.ERROR) {
        return <ErrorHandler error={error} />;
    }

    return (
        <div className={styles.container}>
            <MenuBar />
            <div className={styles.content}>
                <FilterDrawer onActionSelect={handleFilterDrawAction} />
                <Routes>
                    <Route
                        path="artists"
                        element={
                            <Suspense fallback={<Loading />}>
                                <ArtistsList />
                            </Suspense>
                        }
                    />
                    <Route
                        path="gallery"
                        element={
                            <Suspense fallback={<Loading />}>
                                <Gallery />
                            </Suspense>
                        }
                    />
                    <Route
                        path="battles"
                        element={
                            <Suspense fallback={<Loading />}>
                                <BattlesList />
                            </Suspense>
                        }
                    />
                    <Route
                        path="regiments"
                        element={
                            <Suspense fallback={<Loading />}>
                                <RegimentsList />
                            </Suspense>
                        }
                    />
                    <Route
                        path="settings"
                        element={
                            <Suspense fallback={<Loading />}>
                                <Settings />
                            </Suspense>
                        }
                    />
                    <Route
                        path="collections"
                        element={
                            <Suspense fallback={<Loading />}>
                                <CollectionList />
                            </Suspense>
                        }
                    />
                    <Route
                        path="collectionDetailView/:collectionId"
                        element={
                            <Suspense fallback={<Loading />}>
                                <CollectionDetailView />
                            </Suspense>
                        }
                    />
                    <Route
                        path="collectionDetailEdit/:collectionId"
                        element={
                            <Suspense fallback={<Loading />}>
                                <CollectionDetailEdit />
                            </Suspense>
                        }
                    />
                    <Route
                        path="collectionDetailAdd/"
                        element={
                            <Suspense fallback={<Loading />}>
                                <CollectionDetailAdd />
                            </Suspense>
                        }
                    />
                    <Route
                        path="itemDetailView/:itemId"
                        element={
                            <Suspense fallback={<Loading />}>
                                <ItemDetailView />
                            </Suspense>
                        }
                    />
                    <Route
                        path="itemDetailEdit/:itemId"
                        element={
                            <Suspense fallback={<Loading />}>
                                <ItemDetailEdit />
                            </Suspense>
                        }
                    />
                    <Route
                        path="itemDetailAdd/"
                        element={
                            <Suspense fallback={<Loading />}>
                                <ItemDetailAdd />
                            </Suspense>
                        }
                    />
                    <Route
                        path="allTags/"
                        element={
                            <Suspense fallback={<Loading />}>
                                <TagsList />
                            </Suspense>
                        }
                    />

                    <Route path="loading" element={<Loading />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
};
