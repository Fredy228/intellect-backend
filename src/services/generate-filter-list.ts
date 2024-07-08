import { QueryGetAllType } from '../types/query.type';
import { Like } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom-exception';

type OrmOptionType = { [key: string]: any };

export const generateFilterList = (
  { range = [1, 20], filter, sort }: QueryGetAllType,
  searchField: string[] = [],
) => {
  const filterOption: OrmOptionType = {};
  const rangeOption: OrmOptionType = {};
  const sortOption: OrmOptionType = {};

  if (filter) {
    Object.keys(filter).forEach((key: string) => {
      if (searchField.includes(key)) {
        filterOption[key] = Like('%' + filter[key] + '%');
      } else {
        filterOption[key] = filter[key];
      }
    });
  }

  if (range && range.length === 2) {
    rangeOption.take = range[1] - range[0] + 1;
    rangeOption.skip = range[0];
  }

  if (sort && sort.length === 2) sortOption[sort[0]] = sort[1];

  return { filterOption, rangeOption, sortOption };
};

export const parseQueryGetAll = (query: {
  range?: string;
  sort?: string;
  filter?: string;
}): QueryGetAllType => {
  try {
    const filter = query.filter ? JSON.parse(query.filter) : {};
    const sort = query.sort ? JSON.parse(query.sort) : {};
    const range = query.range ? JSON.parse(query.range) : {};

    if (sort && sort.length !== 2) new Error();
    if (range && range.length !== 2) new Error();

    return {
      filter,
      sort,
      range,
    };
  } catch (e) {
    throw new CustomException(HttpStatus.BAD_REQUEST, `Wrong query`);
  }
};
