type Item = {
  artist: {
    name: string;
  };
  contentId: string;
  descriptionLong: string;
  descriptionShort: string;
  id: string;
  publicId: string;
  /** @deprecated Use regiments */
  regiment: string;
  regiments: string;
  tags: string[];
  title: string;
  yearFrom: string;
  yearTo: string;
};

export type { Item };
