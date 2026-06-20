import { ArtistTag } from './ArtistTag.type';
import { BattleTag } from './BattleTag.type';
import { Collection } from './Collection.type';
import { Item } from './Item.type';
import { ItemMetaData } from './ItemMetaData.type';
import { ItemTag } from './ItemTag.type';
import { NavigationTag } from './NavigationTag.type';
import { RatingsType } from './RatingsType.type';
import { Tag } from './Tag.type';
import { TagCount } from './TagCount.type';
import { Template } from './Template.type';

type helmetContextType = {
    title: string;
    setTitle: (title: string) => void;
    meta: any;
    setMeta: (meta: any) => void;
    link: any;
    setLink: (link: any) => void;
    script: any;
    setScript: (script: any) => void;
    style: string | [];
    setStyle: (style: string | []) => void;
};

export type {
    ArtistTag,
    BattleTag,
    Collection,
    helmetContextType,
    Item,
    ItemMetaData,
    ItemTag,
    NavigationTag,
    RatingsType,
    Tag,
    TagCount,
    Template,
};
