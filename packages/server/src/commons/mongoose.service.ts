import {
  Model,
  Document,
  Types,
  ModelPopulateOptions,
  FilterQuery,
} from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ObjectID } from 'typeorm';
import { TreeNode, ListResult } from './commons.dto';

export type Criteria = FilterQuery<any>;

export interface SearParam {
  field: string;
  keyword?: string;
}

@Injectable()
export class MongooseService<T extends Document> {
  defaultQueryFields: string[] = [];

  constructor(protected model: Model<T>) {}

  async create(entry: Partial<T>): Promise<T> {
    const instance = new this.model(entry);
    return await instance.save();
  }

  async update(
    entry: Partial<T>,
    fields: string[] = this.defaultQueryFields,
  ): Promise<T> {
    const conditions: FilterQuery<T> = { _id: entry.id };
    const updateQuery: any = { $set: entry };

    const instance = await this.model
      .findOneAndUpdate(conditions, updateQuery, {
        upsert: true,
        fields: this.getFields(fields),
        new: true,
      })
      .exec();
    return instance;
  }

  protected async query(
    page = 1,
    size = 10,
    query: Criteria = {},
    search: SearParam = { field: 'name' },
    fields: string[] = this.defaultQueryFields,
    sort: Criteria | string = { _id: 1 },
    populate?: ModelPopulateOptions | ModelPopulateOptions[],
  ): Promise<ListResult<T>> {
    page = page < 1 ? 1 : page;
    const condition: any = this.strip(query);
    if (search && search.keyword) {
      condition[search.field] = new RegExp(search.keyword, 'i');
    }
    const selectFields: Criteria = this.getFields(fields);
    let listQuery = this.model
      .find(condition)
      .select(selectFields)
      .sort(sort);

    if (populate) {
      listQuery = listQuery.populate(populate);
    }

    const collection = this.model.find(condition);
    return new Promise<ListResult<T>>(async resolve => {
      const items = (await listQuery.limit(size).skip(size * (page - 1))) || [];
      const result: ListResult<T> = {
        list: items,
        count: await collection.countDocuments(),
        query: {
          page: page,
          size: size,
        },
      };
      resolve(result);
    });
  }

  async searchTree(
    model: Model<Document>,
    keyword?: string,
    id?: string,
    category = '',
    limit = 10,
    labelField = 'name',
    valueField = '_id',
    searchField = 'name',
  ): Promise<TreeNode[]> {
    const criteria: Criteria = {};
    criteria[searchField] = new RegExp(keyword, 'i');
    const query: Criteria = keyword ? criteria : {};

    if (category) {
      query.category = category;
    }

    const fields: Criteria = {};
    fields[labelField] = 1;
    fields[valueField] = 1;
    fields['parent'] = 1;

    const docs =
      (await model
        .find(query)
        .select(fields)
        .limit(limit)
        .exec()) || [];

    if (id && (Types.ObjectId.isValid(id) || valueField !== '_id')) {
      const conditions: Criteria = {};
      conditions[valueField] = id;
      const selected = await model.findOne(conditions).select(fields);
      if (selected) {
        const found = docs.findIndex(doc => doc[valueField] == id);
        if (found === -1) {
          docs.push(selected);
        }
      }
    }

    return docs.map((item: any) => {
      const result = {
        title: item[labelField],
        id: item[valueField],
        parent: item['parent'],
      };
      return result;
    }) as any;
  }

  /**
   * searchable list
   * @param keyword keyword
   * @param id implicit match the value of id
   * @param category category of data
   * @param limit record count of data
   * @param labelField which field to output as list label
   * @param valueField which field to output as list value
   * @param searchField which field to match keyword
   */
  async search(
    keyword?: string,
    id?: string,
    category = '',
    limit = 10,
    labelField = 'name',
    valueField = '_id',
    searchField = 'name',
  ): Promise<any[]> {
    const query: Criteria = {};
    if (keyword) {
      query[searchField] = new RegExp(keyword, 'i');
    }

    if (category) {
      query.category = category;
    }

    const fields: Criteria = {};
    fields[labelField] = 1;
    fields[valueField] = 1;

    const docs =
      (await this.model
        .find(query)
        .select(fields)
        .limit(limit)
        .exec()) || [];

    if (id && (Types.ObjectId.isValid(id) || valueField !== '_id')) {
      const conditions: Criteria = {};
      conditions[valueField] = id;
      const selected = await this.model.findOne(conditions).select(fields);
      if (selected) {
        const found = docs.findIndex(doc => doc[valueField] == id);
        if (found === -1) {
          docs.push(selected);
        }
      }
    }

    return docs.map(item => {
      const result = {
        label: item[labelField],
        value: item[valueField],
      };
      return result;
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async findOne(conditions?: any): Promise<T> {
    if (typeof conditions == 'string') {
      return await this.model.findById(conditions).exec();
    }
    return await this.model.findOne(conditions).exec();
  }

  async findById(id: string | number | ObjectID): Promise<T> {
    return await this.model.findById(id).exec();
  }

  async remove(id: string | number | ObjectID): Promise<any> {
    const entity = await this.model.findById(id);
    if (entity) {
      return await this.model.deleteOne(entity.toJSON());
    } else {
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected getFields(fields: string[]) {
    const selectFields: {
      [key: string]: 0 | 1;
    } = {};
    fields.forEach(field => {
      selectFields[field] = 1;
    });
    return selectFields;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  strip(obj: { [k: string]: any }) {
    Object.keys(obj).forEach(key =>
      obj[key] === undefined ? delete obj[key] : '',
    );
    return Object.assign({}, obj);
  }
}
