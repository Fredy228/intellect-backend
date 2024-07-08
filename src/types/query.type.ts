export type QueryGetAllType = {
  range?: number[];
  sort?: string[];
  filter?: {
    [key: string]: string;
  };
};

export type QueryGetAllStringifyType = {
  range?: string;
  sort?: string;
  filter?: string;
};
